const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const handleNewUser = require('../controllers/registerController');

router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({
      min: 6,
    }),
  ],
  handleNewUser
);

module.exports = router;
