// profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profileController');
const upload = require('../../middleware/upload');
const auth = require('../../middleware/auth');

// Profile operations
router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);
router.post(
  '/picture',
  auth,
  upload.single('profileImage'),
  profileController.uploadProfilePicture
);
router.get('/browse', auth, profileController.getProfiles);

module.exports = router;
