const User = require('../model/User');

/**
 * Upload profile picture
 * @route POST /api/profile/upload
 * @access Private
 */
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please select an image' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user's profile image URL with the correct path
    // Make sure the URL matches the actual file path
    const profileImageUrl = `/uploads/profiles/${req.file.filename}`;
    user.profileImageUrl = profileImageUrl;
    await user.save();

    // Log the URL for debugging
    console.log('Profile image URL:', profileImageUrl);

    res.json({
      msg: 'Profile picture updated',
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    console.log('Error uploading profile picture:', error);
    res.status(500).json({ msg: 'Something went wrong' });
  }
};

module.exports = {
  uploadProfilePicture,
};
