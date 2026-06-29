import { createHash } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const allowedTypes = new Set(['traveler', 'business', 'facilitator', 'community_partner']);
const MAX_BODY_BYTES = 32_000;
const RATE_LIMIT_MAX = 25;
const RATE_WINDOW_MINUTES = 15;
let schemaReady;

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || String(req.headers['x-real-ip'] || 'unknown');
}

function hashIp(ip) {
  return createHash('sha256').update(`${process.env.RATE_LIMIT_SALT || 'unigo-beta'}:${ip}`).digest('hex');
}

function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const requestHost = String(req.headers['x-forwarded-host'] || req.headers.host || '');
    return originHost === requestHost || originHost === 'unigo.now' || originHost === 'www.unigo.now' || originHost.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

async function ensureSchema(sql) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS beta_signups (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          signup_type TEXT NOT NULL,
          organization TEXT,
          city TEXT,
          message TEXT,
          consent BOOLEAN NOT NULL DEFAULT TRUE,
          source TEXT NOT NULL DEFAULT 'website',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (email, signup_type)
        )
      `;
      await sql`ALTER TABLE beta_signups ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;
      await sql`CREATE INDEX IF NOT EXISTS beta_signups_created_at_idx ON beta_signups (created_at DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS beta_signups_type_idx ON beta_signups (signup_type)`;
      await sql`
        CREATE TABLE IF NOT EXISTS signup_rate_limits (
          ip_hash TEXT NOT NULL,
          window_start TIMESTAMPTZ NOT NULL,
          request_count INTEGER NOT NULL DEFAULT 1,
          PRIMARY KEY (ip_hash, window_start)
        )
      `;
    })().catch(error => {
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}

async function checkRateLimit(sql, ipHash) {
  const rows = await sql`
    INSERT INTO signup_rate_limits (ip_hash, window_start, request_count)
    VALUES (${ipHash}, date_trunc('minute', NOW()) - ((EXTRACT(MINUTE FROM NOW())::int % ${RATE_WINDOW_MINUTES}) * INTERVAL '1 minute'), 1)
    ON CONFLICT (ip_hash, window_start)
    DO UPDATE SET request_count = signup_rate_limits.request_count + 1
    RETURNING request_count
  `;
  if (Math.random() < 0.03) {
    await sql`DELETE FROM signup_rate_limits WHERE window_start < NOW() - INTERVAL '1 day'`;
  }
  return Number(rows[0]?.request_count || 1) <= RATE_LIMIT_MAX;
}

async function saveSignup(sql, values) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await sql`
        INSERT INTO beta_signups (name, email, signup_type, organization, city, message, consent, source)
        VALUES (${values.name}, ${values.email}, ${values.type}, ${values.organization || null}, ${values.city || null}, ${values.message || null}, ${values.consent}, ${values.source})
        ON CONFLICT (email, signup_type)
        DO UPDATE SET
          name = EXCLUDED.name,
          organization = EXCLUDED.organization,
          city = EXCLUDED.city,
          message = EXCLUDED.message,
          consent = EXCLUDED.consent,
          source = EXCLUDED.source,
          updated_at = NOW()
        RETURNING id, created_at
      `;
    } catch (error) {
      lastError = error;
      if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 120));
    }
  }
  throw lastError;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!originAllowed(req)) return res.status(403).json({ error: 'Request origin is not allowed' });
  if (Number(req.headers['content-length'] || 0) > MAX_BODY_BYTES) return res.status(413).json({ error: 'Request is too large' });
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: 'Signup service is temporarily unavailable' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (String(body.website || '').trim()) return res.status(200).json({ ok: true });

    const name = String(body.name || '').trim().replace(/\s+/g, ' ').slice(0, 120);
    const email = String(body.email || '').trim().toLowerCase().slice(0, 254);
    const type = String(body.type || 'traveler').trim();
    const organization = String(body.organization || '').trim().slice(0, 160);
    const city = String(body.city || '').trim().slice(0, 120);
    const message = String(body.message || '').trim().slice(0, 2000);
    const consent = body.consent === true || body.consent === 'true' || body.consent === 'on';
    const source = String(body.source || 'website').trim().slice(0, 60) || 'website';

    if (!name || !email || !consent) return res.status(400).json({ error: 'Name, email and consent are required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address' });
    if (!allowedTypes.has(type)) return res.status(400).json({ error: 'Invalid signup type' });

    const sql = neon(process.env.DATABASE_URL);
    await ensureSchema(sql);
    const allowed = await checkRateLimit(sql, hashIp(getClientIp(req)));
    if (!allowed) {
      res.setHeader('Retry-After', String(RATE_WINDOW_MINUTES * 60));
      return res.status(429).json({ error: 'Too many signup attempts. Please try again shortly.' });
    }

    const rows = await saveSignup(sql, { name, email, type, organization, city, message, consent, source });
    return res.status(200).json({ ok: true, signupId: String(rows[0]?.id || '') });
  } catch (error) {
    console.error('beta-signup error', { message: error?.message, code: error?.code });
    return res.status(503).json({ error: 'Unable to save your signup right now. Please try again.' });
  }
}
