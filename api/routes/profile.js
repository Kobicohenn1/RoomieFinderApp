const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const User = require('../model/User');
const auth = require('../middleware/auth');

router.post(
  '/upload',
  auth,
  upload.single('profileImage'),
  async (req, res) => {
    console.log(req.file);
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      user.profileImageUrl = `/uploads/profiles/${req.file.filename}`;
      await user.save();

      res.json({
        msg: 'Profile picture uploaded successfully',
        profileImageUrl: user.profileImageUrl,
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
