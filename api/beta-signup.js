import { neon } from '@neondatabase/serverless';

const allowedTypes = new Set(['traveler', 'business', 'facilitator', 'community_partner']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'Database is not configured' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const name = String(body.name || '').trim().slice(0, 120);
    const email = String(body.email || '').trim().toLowerCase().slice(0, 254);
    const type = String(body.type || 'traveler').trim();
    const organization = String(body.organization || '').trim().slice(0, 160);
    const city = String(body.city || '').trim().slice(0, 120);
    const message = String(body.message || '').trim().slice(0, 2000);
    const consent = body.consent === true || body.consent === 'true' || body.consent === 'on';

    if (!name || !email || !consent) {
      return res.status(400).json({ error: 'Name, email and consent are required' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    if (!allowedTypes.has(type)) {
      return res.status(400).json({ error: 'Invalid signup type' });
    }

    const sql = neon(process.env.DATABASE_URL);
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
        UNIQUE (email, signup_type)
      )
    `;

    await sql`
      INSERT INTO beta_signups (name, email, signup_type, organization, city, message, consent)
      VALUES (${name}, ${email}, ${type}, ${organization || null}, ${city || null}, ${message || null}, ${consent})
      ON CONFLICT (email, signup_type)
      DO UPDATE SET
        name = EXCLUDED.name,
        organization = EXCLUDED.organization,
        city = EXCLUDED.city,
        message = EXCLUDED.message,
        consent = EXCLUDED.consent,
        created_at = NOW()
    `;

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('beta-signup error', error);
    return res.status(500).json({ error: 'Unable to save your signup right now' });
  }
}
