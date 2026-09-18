const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'riders-city-hub-super-secret-key-2026';

/**
 * Middleware to authenticate requests via JWT or development role headers
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : req.headers['x-auth-token'];

  // Support development fallback if direct role header is supplied (for local ease)
  if (!token && req.headers['x-user-role']) {
    req.user = {
      id: req.headers['x-user-id'] || 0,
      username: req.headers['x-username'] || 'dev_user',
      role: req.headers['x-user-role']
    };
    return next();
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      code: 'UNAUTHORIZED',
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'Invalid or expired session token.'
    });
  }
}

/**
 * Role-Based Access Control (RBAC) middleware factory
 * @param  {...string} allowedRoles - e.g. requireRole('Admin') or requireRole('Admin', 'Cashier')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHENTICATED',
        message: 'Authentication required for this operation.'
      });
    }

    const hasRole = allowedRoles.some(
      (role) => role.toLowerCase() === req.user.role.toLowerCase()
    );

    if (!hasRole) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}]. Current role: ${req.user.role}.`
      });
    }

    next();
  };
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireRole
};

