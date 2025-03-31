const express = require('express');
const router = express.Router();
const User = require('../model/User');
const auth = require('../middleware/auth');

// GET current user's profile
router.route('/profile').get(auth, async (req, res) => {
  try {
    console.log('Profile request received for user:', req.user.id);

    const user = await User.findById(req.user.id).select('-password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('Sending user profile data');
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error details:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });
    res.status(500).json({ msg: 'Server error', details: error.message });
  }
});

// GET user data by ID
router.route('/:id').get(auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
