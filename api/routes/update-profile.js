const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateProfile } = require('../controllers/updateProfileController');

// @route   PUT api/profile/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', auth, updateProfile);

module.exports = router;
