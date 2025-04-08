const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, getUserById } = require('../controllers/userController');

// Get user profile
router.get('/profile', auth, getProfile);

// Get user by id
router.get('/:id', auth, getUserById);

module.exports = router;
