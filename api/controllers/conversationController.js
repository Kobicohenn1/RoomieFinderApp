const Conversation = require('../model/Conversation');
const Message = require('../model/Message');
const { validationResult } = require('express-validator');

// Get all conversations for a user
exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'username profileImageUrl')
      .sort('-updatedAt');

    if (!conversations) {
      return res.status(404).json({ message: 'No conversations found' });
    }

    res.json(conversations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all messages for a conversation
exports.getMessagesForConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'username profileImageUrl')
      .sort('timestamp');

    if (!messages.length) {
      return res.status(200).json([]); // Return an empty array if no messages found
    }

    res.json(messages);
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
