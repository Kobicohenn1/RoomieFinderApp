const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const conversationController = require('../controllers/conversationController');

// Get all conversations for a user
router.get('/', auth, conversationController.getAllConversations);

// Get all messages for a conversation
router.get(
  '/:conversationId/messages',
  auth,
  conversationController.getMessagesForConversation
);

module.exports = router;
