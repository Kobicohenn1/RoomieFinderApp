const User = require('../model/User');

// profileController.js
exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      msg: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ msg: 'Invalid updates data' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const allowedFields = [
      'hasApartment',
      'gender',
      'occupation',
      'personality',
      'lifestyle',
      'introduceYourself',
      'music',
      'sports',
      'movieGenres',
      'city',
      'age',
      'smokingHabit',
      'pets',
      'lookingFor',
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        if (
          ['music', 'sports', 'movieGenres'].includes(field) &&
          !Array.isArray(updates[field])
        ) {
          return;
        }
        user[field] = updates[field];
      }
    });

    await user.save();
    res.json({ msg: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.uploadProfilePicture = async (req, res) => {
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

    res.json({
      msg: 'Profile picture updated',
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    console.log('Error uploading profile picture:', error);
    res.status(500).json({ msg: 'Something went wrong' });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await User.find({}, '-password'); // Exclude password
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
