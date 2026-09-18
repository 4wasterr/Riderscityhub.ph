const pool = require('../db');

/**
 * List products with optional search and filters
 */
async function getAllProducts(req, res) {
  const { category, brand, status = 'Active', search } = req.query;
  let query = 'SELECT p.*, s.name as supplier_name FROM products p LEFT JOIN suppliers s ON p.supplier_id = s.id WHERE 1=1';
  const params = [];

  if (status && status !== 'All') {
    params.push(status);
    query += ` AND p.status = $${params.length}`;
  }
  if (category && category !== 'All') {
    params.push(category);
    query += ` AND p.category = $${params.length}`;
  }
  if (brand && brand !== 'All') {
    params.push(brand);
    query += ` AND p.brand = $${params.length}`;
  }
  if (search) {
    params.push(`%${search.trim().toLowerCase()}%`);
    query += ` AND (LOWER(p.name) LIKE $${params.length} OR LOWER(p.sku) LIKE $${params.length} OR LOWER(p.product_code) LIKE $${params.length})`;
  }

  query += ' ORDER BY p.name ASC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('getAllProducts error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
}

/**
 * Create a new product
 */
async function createProduct(req, res) {
  const {
    sku,
    name,
    category,
    brand,
    productType,
    costPrice = 0,
    sellingPrice = 0,
    currentStock = 0,
    reorderLevel = 10,
    supplierId,
    status = 'Active',
  } = req.body;

  try {
    const productCode = `PROD-${Date.now().toString().slice(-4)}`;
    const result = await pool.query(
      `INSERT INTO products (
        product_code, sku, name, category, brand, product_type,
        cost_price, selling_price, current_stock, reorder_level,
        supplier_id, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        productCode,
        sku.trim(),
        name.trim(),
        category.trim(),
        brand.trim(),
        productType,
        costPrice,
        sellingPrice,
        parseInt(currentStock, 10) || 0,
        parseInt(reorderLevel, 10) || 10,
        supplierId || null,
        status,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createProduct error:', err.message);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Product SKU or Code already exists' });
    }
    res.status(500).json({ error: 'Database error' });
  }
}

/**
 * Update stock level and record inventory movement history
 */
async function updateStock(req, res) {
  const { id } = req.params;
  const { movementType, quantity, unitCost, notes, supplierId } = req.body;

  if (!movementType || !['Stock In', 'Stock Out'].includes(movementType)) {
    return res.status(400).json({ error: "Movement type must be 'Stock In' or 'Stock Out'" });
  }
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ error: 'Quantity must be greater than zero' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check existing product
    const prodRes = await client.query('SELECT * FROM products WHERE id = $1 FOR UPDATE', [id]);
    if (prodRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentStock = prodRes.rows[0].current_stock;
    const newStock = movementType === 'Stock In' ? currentStock + qty : currentStock - qty;

    if (newStock < 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `Insufficient stock. Current stock is ${currentStock}` });
    }

    // Update product stock
    const updatedProdRes = await client.query(
      'UPDATE products SET current_stock = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [newStock, id]
    );

    // Record inventory movement
    const historyCode = `#HST-${Date.now().toString().slice(-5)}`;
    await client.query(
      `INSERT INTO inventory_movements (
        history_code, product_id, movement_type, quantity, unit_cost,
        supplier_id, performed_by, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        historyCode,
        id,
        movementType,
        qty,
        unitCost || prodRes.rows[0].cost_price,
        supplierId || null,
        req.user ? req.user.id : null,
        notes || null
      ]
    );

    await client.query('COMMIT');
    res.json({ message: 'Stock updated successfully', product: updatedProdRes.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('updateStock error:', err.message);
    res.status(500).json({ error: 'Failed to update stock' });
  } finally {
    client.release();
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  updateStock
};

