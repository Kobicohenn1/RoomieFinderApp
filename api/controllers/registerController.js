const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const handleNewUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate request data
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ msg: 'Please provide username, email, and password' });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const payload = {
      user: {
        id: newUser.id,
      },
    };

    jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, userId: newUser.id });
      }
    );
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = handleNewUser;
