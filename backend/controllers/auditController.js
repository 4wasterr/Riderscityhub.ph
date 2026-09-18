const pool = require('../db');

/**
 * Fetch system audit logs with search and pagination
 */
async function getAuditLogs(req, res) {
  const { search, limit = 50, offset = 0 } = req.query;
  let query = 'SELECT * FROM audit_logs WHERE 1=1';
  const params = [];

  if (search) {
    params.push(`%${search.trim().toLowerCase()}%`);
    query += ` AND (LOWER(action) LIKE $${params.length} OR LOWER(user_name) LIKE $${params.length} OR LOWER(details) LIKE $${params.length})`;
  }

  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(parseInt(limit, 10) || 50, parseInt(offset, 10) || 0);

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('getAuditLogs error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
}

/**
 * Create an audit log entry
 */
async function createAuditLog(req, res) {
  const { action, details } = req.body;
  if (!action) {
    return res.status(400).json({ error: 'Action description is required' });
  }

  const logCode = `AUD-${Date.now().toString().slice(-4)}`;
  const userId = req.user ? req.user.id : null;
  const userName = req.user ? (req.user.fullName || req.user.username) : 'System';

  try {
    const result = await pool.query(
      `INSERT INTO audit_logs (log_code, user_id, user_name, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [logCode, userId, userName, action, details || '', req.ip || '127.0.0.1']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createAuditLog error:', err.message);
    res.status(500).json({ error: 'Failed to record audit log' });
  }
}

module.exports = {
  getAuditLogs,
  createAuditLog
};

