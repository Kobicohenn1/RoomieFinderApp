const User = require('../model/User'); // Ensure the correct path to your User model

// Update user profile
// Update user profile
exports.updateProfile = async (req, res) => {
  const { userId, updates } = req.body;

  try {
    // Find user by ID
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Specific updates for each field
    if (updates.gender !== undefined) user.gender = updates.gender;
    if (updates.occupation !== undefined) user.occupation = updates.occupation;
    if (updates.personality !== undefined)
      user.personality = updates.personality;
    if (updates.lifestyle !== undefined) user.lifestyle = updates.lifestyle;
    if (updates.introduceYourself !== undefined)
      user.introduceYourself = updates.introduceYourself;
    if (Array.isArray(updates.music)) user.music = updates.music;
    if (Array.isArray(updates.sports)) user.sports = updates.sports;
    if (Array.isArray(updates.movieGenres))
      user.movieGenres = updates.movieGenres;
    if (updates.city !== undefined) user.city = updates.city;
    if (updates.age !== undefined) user.age = updates.age;
    if (updates.smokingHabit !== undefined)
      user.smokingHabit = updates.smokingHabit; // New field
    if (updates.pets !== undefined) user.pets = updates.pets; // New field

    if (updates.lookingFor !== undefined) user.lookingFor = updates.lookingFor;

    // Save the updated user profile
    await user.save();

    res.json({ msg: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
