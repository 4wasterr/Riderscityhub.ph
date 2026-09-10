-- =========================================================================
-- RIDERS CITY HUB POS & INVENTORY SYSTEM - DATABASE SCHEMA (PostgreSQL)
-- =========================================================================

-- 1. USERS TABLE
-- Stores accounts for Admin and Cashier (Cashier & Admin only as per system role constraints)
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  user_code VARCHAR(20) UNIQUE NOT NULL,      -- e.g. 'CSH-001', 'CSH-004'
  username VARCHAR(50) UNIQUE NOT NULL,       -- e.g. 'admin', 'cashier', 'janedoe12'
  first_name VARCHAR(100) NOT NULL,           -- e.g. 'Jane'
  middle_name VARCHAR(100),                   -- e.g. 'Marie'
  last_name VARCHAR(100) NOT NULL,            -- e.g. 'Doe'
  full_name VARCHAR(200) NOT NULL,            -- e.g. 'Jane Doe'
  email VARCHAR(150) UNIQUE NOT NULL,         -- e.g. 'jane.doe@riderscityhub.ph'
  phone VARCHAR(50),                          -- e.g. '0917-123-4567'
  address TEXT,                               -- e.g. 'Manila, Philippines'
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'Cashier'
    CHECK (role IN ('Admin', 'Cashier')),
  status VARCHAR(20) NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active', 'Inactive', 'Archived')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. LOGIN ACTIVITIES TABLE
-- Tracks login and logout sessions shown in User Management module
CREATE TABLE login_activities (
  id BIGSERIAL PRIMARY KEY,
  log_code VARCHAR(20) UNIQUE NOT NULL,       -- e.g. 'LOG-001'
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  logout_time TIMESTAMP,
  ip_address VARCHAR(45),
  status VARCHAR(20) NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active', 'Logged Out', 'Expired'))
);

-- 3. AUDIT LOGS TABLE
-- Tracks administrative actions shown in User Management Audit Logs
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  log_code VARCHAR(20) UNIQUE NOT NULL,       -- e.g. 'AUD-001'
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(150) NOT NULL,            -- Preserved if user is archived
  action VARCHAR(100) NOT NULL,               -- e.g. 'User Created', 'Product Updated', 'Stock In'
  details TEXT,                               -- Action descriptions
  ip_address VARCHAR(45),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. SUPPLIERS TABLE
-- Tracks motorcycle parts and accessory suppliers
CREATE TABLE suppliers (
  id BIGSERIAL PRIMARY KEY,
  supplier_code VARCHAR(20) UNIQUE NOT NULL,  -- e.g. 'SPL-143'
  name VARCHAR(150) NOT NULL,                 -- e.g. 'Moto X Parts', 'ABC Moto'
  contact_person VARCHAR(150),
  phone VARCHAR(50) NOT NULL,                 -- e.g. '+63 917 2345 678'
  email VARCHAR(150),
  address TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active', 'Inactive', 'Archived')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. PRODUCTS & INVENTORY TABLE
-- Stores product specifications, categories, brands, costs, and stock levels
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  product_code VARCHAR(20) UNIQUE NOT NULL,   -- e.g. 'PROD-001', 'ID-123A'
  sku VARCHAR(50) UNIQUE NOT NULL,            -- e.g. 'EGO-001', 'LDH-123'
  name VARCHAR(200) NOT NULL,                 -- e.g. '1L Engine Oil', 'LED Headlight'
  category VARCHAR(100) NOT NULL,             -- e.g. 'Engine Oil', 'Helmet', 'Brakes', 'Headlight'
  brand VARCHAR(100) NOT NULL,                -- e.g. 'Castrol', 'Yamaha', 'Brembo', 'Shimano'
  product_type VARCHAR(100),                  -- e.g. 'Synthetic', 'Ceramic', 'LED', 'Accessory'
  cost_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,   -- Purchase cost e.g. 1500.00
  selling_price NUMERIC(12,2) NOT NULL DEFAULT 0.00, -- Retail selling price e.g. 1700.00
  current_stock INTEGER NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  reorder_level INTEGER NOT NULL DEFAULT 10,  -- Triggers low stock alert (e.g. <= 10)
  supplier_id BIGINT REFERENCES suppliers(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active', 'Inactive', 'Archived')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. INVENTORY MOVEMENTS / HISTORY TABLE
-- Logs every "Stock In" and "Stock Out" movement (Inventory History module)
CREATE TABLE inventory_movements (
  id BIGSERIAL PRIMARY KEY,
  history_code VARCHAR(20) UNIQUE NOT NULL,   -- e.g. '#HST-001'
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL
    CHECK (movement_type IN ('Stock In', 'Stock Out')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(12,2),
  supplier_id BIGINT REFERENCES suppliers(id) ON DELETE SET NULL,
  performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. TRANSACTIONS / SALES TABLE
-- Records POS sales transactions displayed on Admin and Cashier dashboards
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  transaction_no VARCHAR(50) UNIQUE NOT NULL, -- e.g. '#TRX-001'
  cashier_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  cashier_name VARCHAR(150) NOT NULL,         -- e.g. 'Jane'
  total_items INTEGER NOT NULL DEFAULT 1 CHECK (total_items > 0),
  total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
  payment_method VARCHAR(30) NOT NULL DEFAULT 'Cash'
    CHECK (payment_method IN ('Cash', 'GCash', 'Maya', 'Card')),
  status VARCHAR(20) NOT NULL DEFAULT 'Completed'
    CHECK (status IN ('Completed', 'Voided', 'Refunded')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. TRANSACTION ITEMS TABLE
-- Individual items sold inside each transaction
CREATE TABLE transaction_items (
  id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  product_name VARCHAR(200) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12,2) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL
);

-- 9. CASHIER DAILY SHIFT REPORTS TABLE
-- Stores reports submitted by cashiers via "Send Report" on the cashier dashboard
CREATE TABLE cashier_reports (
  id BIGSERIAL PRIMARY KEY,
  cashier_id BIGINT NOT NULL REFERENCES users(id),
  cashier_name VARCHAR(150) NOT NULL,
  shift_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_transactions INTEGER NOT NULL DEFAULT 0,
  total_cash_collected NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  notes TEXT,                                 -- Discrepancies or shift handover remarks
  status VARCHAR(20) NOT NULL DEFAULT 'Submitted'
    CHECK (status IN ('Submitted', 'Reviewed', 'Approved')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. STORE SETTINGS TABLE
-- Stores configuration from Settings module (Store details, auto logout, session timeout)
CREATE TABLE store_settings (
  id BIGSERIAL PRIMARY KEY,
  store_name VARCHAR(150) NOT NULL DEFAULT 'Riders City Hub',
  store_address_1 TEXT NOT NULL DEFAULT '123 Rizal Avenue, Sta. Cruz',
  store_address_2 TEXT DEFAULT 'Manila, Metro Manila, Philippines',
  email_address VARCHAR(150) NOT NULL DEFAULT 'contact@riderscityhub.ph',
  business_hours VARCHAR(150) DEFAULT '8:00 AM - 7:00 PM (Mon - Sat)',
  auto_logout_duration VARCHAR(20) DEFAULT '15m',
  session_timeout_duration VARCHAR(20) DEFAULT '8h',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- INITIAL SEED DATA (Default Admin & Cashier Accounts matching the system)
-- =========================================================================

-- Seed default Admin and Cashier accounts
INSERT INTO users (user_code, username, first_name, middle_name, last_name, full_name, email, password_hash, role, status)
VALUES 
  ('CSH-000', 'admin', 'Admin', 'System', 'User', 'System Administrator', 'admin@riderscityhub.ph', 'admin', 'Admin', 'Active'),
  ('CSH-001', 'cashier', 'Jane', 'Marie', 'Doe', 'Cashier Jane', 'cashier@riderscityhub.ph', 'cashier', 'Cashier', 'Active');

-- Seed default store settings
INSERT INTO store_settings (store_name, store_address_1, store_address_2, email_address, business_hours, auto_logout_duration, session_timeout_duration)
VALUES ('Riders City Hub', '123 Rizal Avenue, Sta. Cruz', 'Manila, Metro Manila, Philippines', 'contact@riderscityhub.ph', '8:00 AM - 7:00 PM (Mon - Sat)', '15m', '8h');