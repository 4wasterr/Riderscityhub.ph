/**
 * Request body and parameter validation middleware
 */

function validateLogin(req, res, next) {
  const { username, password } = req.body || {};
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  next();
}

function validateUser(req, res, next) {
  const { username, password, firstName, lastName, email, role } = req.body || {};

  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username is required' });
  }
  if (!password || password.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  }
  if (!firstName || !firstName.trim()) {
    return res.status(400).json({ error: 'First name is required' });
  }
  if (!lastName || !lastName.trim()) {
    return res.status(400).json({ error: 'Last name is required' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (role && !['Admin', 'Cashier'].includes(role)) {
    return res.status(400).json({ error: "Role must be either 'Admin' or 'Cashier'" });
  }

  next();
}

function validateSupplier(req, res, next) {
  const { name, phone } = req.body || {};
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Supplier name is required' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: 'Contact phone number is required' });
  }
  next();
}

function validateProduct(req, res, next) {
  const { sku, name, category, brand, costPrice, sellingPrice } = req.body || {};
  if (!sku || !sku.trim()) {
    return res.status(400).json({ error: 'SKU is required' });
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  if (!category || !category.trim()) {
    return res.status(400).json({ error: 'Product category is required' });
  }
  if (!brand || !brand.trim()) {
    return res.status(400).json({ error: 'Brand is required' });
  }
  if (costPrice !== undefined && (isNaN(costPrice) || Number(costPrice) < 0)) {
    return res.status(400).json({ error: 'Cost price must be a non-negative number' });
  }
  if (sellingPrice !== undefined && (isNaN(sellingPrice) || Number(sellingPrice) < 0)) {
    return res.status(400).json({ error: 'Selling price must be a non-negative number' });
  }
  next();
}

module.exports = {
  validateLogin,
  validateUser,
  validateSupplier,
  validateProduct
};

