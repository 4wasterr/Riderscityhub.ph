require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Backend server is running!'
  });
});

// Health check and database test endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({
      status: 'success',
      database: 'connected',
      time: result.rows[0].current_time
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: error.message
    });
  }
});

// Generate next available user code based on role (ADM-001, CSH-001, ...)
app.get('/api/users/next-code', async (req, res) => {
  const { role } = req.query;
  const prefix = role === 'Admin' ? 'ADM' : 'CSH';
  try {
    // Count existing users with the same prefix in user_code
    const result = await pool.query(
      `SELECT COUNT(*) AS total FROM users WHERE user_code LIKE $1`,
      [`${prefix}-%`]
    );
    const next = parseInt(result.rows[0].total, 10) + 1;
    const code = `${prefix}-${String(next).padStart(3, '0')}`;
    res.json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// New user creation endpoint
const bcrypt = require('bcrypt');

// POST /api/login — authenticate against DB with bcrypt
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE username = $1 AND status = 'Active' LIMIT 1`,
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Return safe user info (no password_hash)
    const { password_hash, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    console.error('POST /api/login error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/users — list all active users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_code, username, first_name, middle_name, last_name, full_name, email, phone, address, role, status, created_at
       FROM users ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/users error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { userCode, username, password, role, email, phone, firstName, middleName, lastName, address } = req.body;
  if (!username || !password || !firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Missing required fields (username, password, firstName, lastName, email)' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    // Build full_name from name parts
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    // Use the role-based code from frontend (e.g. CSH-001 / ADM-001)
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
      `INSERT INTO users (user_code, username, password_hash, role, email, phone, first_name, middle_name, last_name, full_name, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [code, username, passwordHash, role, email, phone, firstName, middleName || null, lastName, fullName, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/users error:', err.message);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username, email, or user code already exists' });
    }
    res.status(500).json({ error: err.message || 'Database error' });
  }
});

// New supplier creation endpoint
app.post('/api/suppliers', async (req, res) => {
  const { name, contactPerson, phone, email, address, status } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const supplierCode = `SUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const result = await pool.query(
      `INSERT INTO suppliers (supplier_code, name, contact_person, phone, email, address, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [supplierCode, name, contactPerson, phone, email, address, status || 'Active']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Supplier already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

// New product creation endpoint
app.post('/api/products', async (req, res) => {
  const {
    sku,
    name,
    category,
    brand,
    productType,
    costPrice,
    sellingPrice,
    currentStock,
    reorderLevel,
    supplierId,
    status,
  } = req.body;
  if (!sku || !name || !category || !brand) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }
  try {
    const productCode = `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const result = await pool.query(
      `INSERT INTO products (product_code, sku, name, category, brand, product_type, cost_price, selling_price, current_stock, reorder_level, supplier_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        productCode,
        sku,
        name,
        category,
        brand,
        productType,
        costPrice,
        sellingPrice,
        currentStock ?? 0,
        reorderLevel ?? 10,
        supplierId,
        status || 'Active',
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Product already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
