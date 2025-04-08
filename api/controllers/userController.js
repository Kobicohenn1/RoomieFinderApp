const User = require('../model/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
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
