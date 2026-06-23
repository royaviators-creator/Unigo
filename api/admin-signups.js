import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const configuredToken = process.env.ADMIN_TOKEN;
  const auth = req.headers.authorization || '';
  const suppliedToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!configuredToken) {
    return res.status(503).json({ error: 'Admin access is not configured' });
  }
  if (!suppliedToken || suppliedToken !== configuredToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database is not configured' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`
      SELECT id, name, email, signup_type, organization, city, message, consent, source, created_at
      FROM beta_signups
      ORDER BY created_at DESC
      LIMIT 500
    `;

    const totals = rows.reduce((acc, row) => {
      acc.total += 1;
      acc[row.signup_type] = (acc[row.signup_type] || 0) + 1;
      return acc;
    }, { total: 0, traveler: 0, business: 0, facilitator: 0, community_partner: 0 });

    return res.status(200).json({ totals, signups: rows });
  } catch (error) {
    console.error('admin-signups error', error);
    return res.status(500).json({ error: 'Unable to load signups' });
  }
}
