const pool = require('../db');

/**
 * Get store settings
 */
async function getSettings(req, res) {
  try {
    const result = await pool.query('SELECT * FROM store_settings ORDER BY id ASC LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({
        storeName: 'Riders City Hub',
        storeAddress1: '123 Rizal Avenue, Sta. Cruz',
        storeAddress2: 'Manila, Metro Manila, Philippines',
        emailAddress: 'contact@riderscityhub.ph',
        businessHours: '8:00 AM - 7:00 PM (Mon - Sat)',
        autoLogout: '15m',
        sessionTimeout: '8h'
      });
    }
    const row = result.rows[0];
    res.json({
      id: row.id,
      storeName: row.store_name,
      storeAddress1: row.store_address_1,
      storeAddress2: row.store_address_2,
      emailAddress: row.email_address,
      businessHours: row.business_hours,
      autoLogout: row.auto_logout_duration,
      sessionTimeout: row.session_timeout_duration
    });
  } catch (err) {
    console.error('getSettings error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
}

/**
 * Update store settings
 */
async function updateSettings(req, res) {
  const {
    storeName,
    storeAddress1,
    storeAddress2,
    emailAddress,
    businessHours,
    autoLogout,
    sessionTimeout
  } = req.body;

  try {
    const check = await pool.query('SELECT id FROM store_settings LIMIT 1');
    let result;
    if (check.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO store_settings (
          store_name, store_address_1, store_address_2, email_address,
          business_hours, auto_logout_duration, session_timeout_duration
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [storeName, storeAddress1, storeAddress2, emailAddress, businessHours, autoLogout, sessionTimeout]
      );
    } else {
      result = await pool.query(
        `UPDATE store_settings SET
          store_name = COALESCE($1, store_name),
          store_address_1 = COALESCE($2, store_address_1),
          store_address_2 = COALESCE($3, store_address_2),
          email_address = COALESCE($4, email_address),
          business_hours = COALESCE($5, business_hours),
          auto_logout_duration = COALESCE($6, auto_logout_duration),
          session_timeout_duration = COALESCE($7, session_timeout_duration),
          updated_at = NOW()
        WHERE id = $8 RETURNING *`,
        [storeName, storeAddress1, storeAddress2, emailAddress, businessHours, autoLogout, sessionTimeout, check.rows[0].id]
      );
    }

    res.json({ message: 'Settings saved successfully', settings: result.rows[0] });
  } catch (err) {
    console.error('updateSettings error:', err.message);
    res.status(500).json({ error: 'Failed to update settings' });
  }
}

module.exports = {
  getSettings,
  updateSettings
};

