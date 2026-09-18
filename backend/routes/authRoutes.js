const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin } = require('../middleware/validate');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', validateLogin, authController.login);
router.get('/session', authenticateToken, authController.getSession);

module.exports = router;

