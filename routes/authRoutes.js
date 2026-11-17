const express = require('express');
const router = express.Router();
const c = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/register', c.register);
router.post('/login', c.login);
router.get('/me', verifyToken, c.me);

module.exports = router;