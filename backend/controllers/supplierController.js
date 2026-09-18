const pool = require('../db');

/**
 * Get all suppliers with optional status filter
 */
async function getAllSuppliers(req, res) {
  const { status } = req.query;
  let query = 'SELECT * FROM suppliers WHERE 1=1';
  const params = [];

  if (status) {
    params.push(status);
    query += ` AND status = $${params.length}`;
  }

  query += ' ORDER BY created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('getAllSuppliers error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
}

/**
 * Create a new supplier
 */
async function createSupplier(req, res) {
  const { name, contactPerson, phone, email, address, status = 'Active' } = req.body;

  try {
    const supplierCode = `SPL-${Date.now().toString().slice(-4)}`;
    const result = await pool.query(
      `INSERT INTO suppliers (supplier_code, name, contact_person, phone, email, address, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [supplierCode, name.trim(), contactPerson, phone.trim(), email, address, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createSupplier error:', err.message);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Supplier with this code or details already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
}

/**
 * Soft delete / archive supplier
 */
async function archiveSupplier(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE suppliers SET status = 'Archived', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ message: 'Supplier archived successfully', supplier: result.rows[0] });
  } catch (err) {
    console.error('archiveSupplier error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
}

module.exports = {
  getAllSuppliers,
  createSupplier,
  archiveSupplier
};

