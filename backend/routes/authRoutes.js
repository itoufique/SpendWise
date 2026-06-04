const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, profile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../utils/validators');

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.get('/profile', protect, profile);

module.exports = router;
