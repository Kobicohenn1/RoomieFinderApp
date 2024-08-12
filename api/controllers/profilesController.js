const User = require('../model/User');

const getProfiles = async (req, res) => {
  try {
    const profiles = await User.find({}, '-password'); // Exclude password
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = { getProfiles };
