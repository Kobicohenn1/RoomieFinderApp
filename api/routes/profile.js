const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const { uploadProfilePicture } = require('../controllers/profileController');

// Upload profile picture
router.post(
  '/upload',
  auth,
  upload.single('profileImage'),
  uploadProfilePicture
);

module.exports = router;
