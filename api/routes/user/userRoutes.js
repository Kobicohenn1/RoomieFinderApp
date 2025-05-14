const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const auth = require('../../middleware/auth');

// Get user by ID
router.get('/:id', auth, userController.getUserById);

module.exports = router;
