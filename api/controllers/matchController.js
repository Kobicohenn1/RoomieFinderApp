const User = require('../model/User');
const Conversation = require('../model/Conversation');

const likeUser = async (req, res) => {
  const { likedUserId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const likedUser = await User.findById(likedUserId);

    if (!user || !likedUser)
      return res.status(404).json({ msg: 'User not found' });

    if (!user.likedUsers.includes(likedUserId)) {
      user.likedUsers.push(likedUserId);
      await user.save();
    }

    if (likedUser.likedUsers.includes(req.user.id)) {
      if (!user.matches.includes(likedUserId)) {
        user.matches.push(likedUserId);
        await user.save();
      }

      if (!likedUser.matches.includes(req.user.id)) {
        likedUser.matches.push(req.user.id);
        await likedUser.save();
      }

      // Check if a conversation already exists between the two users
      let conversation = await Conversation.findOne({
        participants: { $all: [req.user.id, likedUserId] },
      });

      if (!conversation) {
        // Create a new conversation if one doesn't exist
        conversation = new Conversation({
          participants: [req.user.id, likedUserId],
        });
        await conversation.save();
      }

      return res.json({
        message: "It's a match!",
        conversationId: conversation._id,
      });
    }

    res.json({ message: 'User liked successfully' });
  } catch (err) {
    console.error('Error in likeUser:', err);
    res.status(500).json({ error: 'An error occurred while liking the user' });
  }
};

module.exports = { likeUser };
