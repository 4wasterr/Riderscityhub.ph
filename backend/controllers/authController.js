const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

/**
 * Authenticate user credentials and return user info + JWT token
 */
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE username = $1 AND status != 'Archived' LIMIT 1`,
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];

    if (user.status !== 'Active') {
      return res.status(403).json({ error: 'Account is inactive. Please contact your administrator.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Sign JWT token valid for 8 hours (matches system default timeout)
    const tokenPayload = {
      id: user.id,
      userCode: user.user_code,
      username: user.username,
      role: user.role,
      fullName: user.full_name,
      email: user.email
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });

    // Try logging login activity asynchronously (resilient if table empty)
    try {
      const logCode = `LOG-${Date.now().toString().slice(-4)}`;
      await pool.query(
        `INSERT INTO login_activities (log_code, user_id, ip_address, status)
         VALUES ($1, $2, $3, 'Active')`,
        [logCode, user.id, req.ip || '127.0.0.1']
      );
    } catch (logErr) {
      // Non-blocking log failure
      console.warn('Could not record login_activity:', logErr.message);
    }

    const { password_hash, ...safeUser } = user;
    res.json({
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}

/**
 * Verify current session token
 */
async function getSession(req, res) {
  res.json({ user: req.user });
}

module.exports = {
  login,
  getSession
};

