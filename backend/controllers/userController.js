const bcrypt = require('bcrypt');
const pool = require('../db');

/**
 * Generate sequential role-based user code
 */
async function getNextCode(req, res) {
  const { role } = req.query;
  const prefix = role === 'Admin' ? 'ADM' : 'CSH';
  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS total FROM users WHERE user_code LIKE $1`,
      [`${prefix}-%`]
    );
    const next = parseInt(result.rows[0].total, 10) + 1;
    const code = `${prefix}-${String(next).padStart(3, '0')}`;
    res.json({ code });
  } catch (err) {
    console.error('getNextCode error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
}

/**
 * List users (supports status filter e.g. status=Active or status=Archived)
 */
async function getAllUsers(req, res) {
  const { status, role } = req.query;
  let query = `
    SELECT id, user_code, username, first_name, middle_name, last_name, full_name,
           email, phone, address, role, status, created_at
    FROM users WHERE 1=1
  `;
  const params = [];

  if (status) {
    params.push(status);
    query += ` AND status = $${params.length}`;
  }
  if (role && role !== 'All') {
    params.push(role);
    query += ` AND role = $${params.length}`;
  }

  query += ` ORDER BY created_at DESC`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('getAllUsers error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
}

/**
 * Create a new user account with hashed password and audit logging
 */
async function createUser(req, res) {
  const {
    userCode,
    username,
    password,
    role = 'Cashier',
    email,
    phone,
    firstName,
    middleName,
    lastName,
    address
  } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

    const prefix = role === 'Admin' ? 'ADM' : 'CSH';
    let code = userCode;
    if (!code) {
      const countRes = await pool.query(
        `SELECT COUNT(*) AS total FROM users WHERE user_code LIKE $1`,
        [`${prefix}-%`]
      );
      const next = parseInt(countRes.rows[0].total, 10) + 1;
      code = `${prefix}-${String(next).padStart(3, '0')}`;
    }

    const result = await pool.query(
      `INSERT INTO users (
        user_code, username, password_hash, role, email, phone,
        first_name, middle_name, last_name, full_name, address, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Active')
      RETURNING id, user_code, username, role, email, phone, first_name, middle_name, last_name, full_name, address, status, created_at`,
      [code, username.trim(), passwordHash, role, email.trim(), phone, firstName.trim(), middleName ? middleName.trim() : null, lastName.trim(), fullName, address]
    );

    const newUser = result.rows[0];

    // Audit log (non-blocking)
    try {
      const logCode = `AUD-${Date.now().toString().slice(-4)}`;
      const performer = req.user ? req.user.username : 'System';
      await pool.query(
        `INSERT INTO audit_logs (log_code, user_id, user_name, action, details, ip_address)
         VALUES ($1, $2, $3, 'User Created', $4, $5)`,
        [logCode, req.user ? req.user.id : null, performer, `Created ${role} user: ${newUser.username} (${newUser.user_code})`, req.ip || '127.0.0.1']
      );
    } catch (auditErr) {
      console.warn('Audit log write failed:', auditErr.message);
    }

    res.status(201).json(newUser);
  } catch (err) {
    console.error('createUser error:', err.message);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username, email, or user code already exists' });
    }
    res.status(500).json({ error: err.message || 'Database error' });
  }
}

/**
 * Soft delete / Archive user (preserves foreign key integrity with audit logs & transactions)
 */
async function archiveUser(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE users SET status = 'Archived', updated_at = NOW() WHERE id = $1 RETURNING id, user_code, username, status`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Audit log
    try {
      const logCode = `AUD-${Date.now().toString().slice(-4)}`;
      const performer = req.user ? req.user.username : 'System';
      await pool.query(
        `INSERT INTO audit_logs (log_code, user_id, user_name, action, details, ip_address)
         VALUES ($1, $2, $3, 'User Archived', $4, $5)`,
        [logCode, req.user ? req.user.id : null, performer, `Archived user ID ${id} (${result.rows[0].username})`, req.ip || '127.0.0.1']
      );
    } catch (auditErr) {
      console.warn('Audit log write failed:', auditErr.message);
    }

    res.json({ message: 'User successfully archived', user: result.rows[0] });
  } catch (err) {
    console.error('archiveUser error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
}

/**
 * Restore an archived user back to Active
 */
async function restoreUser(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE users SET status = 'Active', updated_at = NOW() WHERE id = $1 RETURNING id, user_code, username, status`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User successfully restored', user: result.rows[0] });
  } catch (err) {
    console.error('restoreUser error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
}

module.exports = {
  getNextCode,
  getAllUsers,
  createUser,
  archiveUser,
  restoreUser
};

