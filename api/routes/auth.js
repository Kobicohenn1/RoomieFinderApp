const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const handleLogin = require('../controllers/authController');

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  handleLogin
);

module.exports = router;
