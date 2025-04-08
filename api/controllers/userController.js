const User = require('../model/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fix profile image URL if it doesn't include the /profiles/ subdirectory
    if (user.profileImageUrl && !user.profileImageUrl.includes('/profiles/')) {
      // Extract the filename from the current URL
      const filename = user.profileImageUrl.split('/').pop();
      // Create the correct URL with the /profiles/ subdirectory
      const oldUrl = user.profileImageUrl;
      user.profileImageUrl = `/uploads/profiles/${filename}`;
      // Save the updated URL to the database
      await user.save();
      console.log(
        `Fixed profile image URL: ${oldUrl} -> ${user.profileImageUrl}`
      );
    }

    res.json(user);
  } catch (error) {
    console.log('Error getting profile:', error);
    res.status(500).json({ msg: 'Something went wrong' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fix profile image URL if it doesn't include the /profiles/ subdirectory
    if (user.profileImageUrl && !user.profileImageUrl.includes('/profiles/')) {
      // Extract the filename from the current URL
      const filename = user.profileImageUrl.split('/').pop();
      // Create the correct URL with the /profiles/ subdirectory
      const oldUrl = user.profileImageUrl;
      user.profileImageUrl = `/uploads/profiles/${filename}`;
      // Save the updated URL to the database
      await user.save();
      console.log(
        `Fixed profile image URL: ${oldUrl} -> ${user.profileImageUrl}`
      );
    }

    res.json(user);
  } catch (error) {
    console.log('Error getting user:', error);
    res.status(500).json({ msg: 'Something went wrong' });
  }
};

module.exports = {
  getProfile,
  getUserById,
};
