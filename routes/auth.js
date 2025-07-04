const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');

router.post('/register', register); // optional, for initial admin setup
router.post('/login', login);

module.exports = router;
