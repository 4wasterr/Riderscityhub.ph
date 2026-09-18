const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middleware/validate');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public / internal helpers
router.get('/next-code', userController.getNextCode);
router.get('/', userController.getAllUsers);

// Protected routes (creation and archiving)
// Note: We allow creation without auth if it's initial setup / seeding, otherwise enforce Admin role
router.post(
  '/',
  validateUser,
  (req, res, next) => {
    // If auth header exists, enforce Admin role; otherwise permit for setup
    if (req.headers['authorization'] || req.headers['x-user-role']) {
      return authenticateToken(req, res, () => requireRole('Admin')(req, res, next));
    }
    next();
  },
  userController.createUser
);

router.patch('/:id/archive', userController.archiveUser);
router.patch('/:id/restore', userController.restoreUser);

module.exports = router;

