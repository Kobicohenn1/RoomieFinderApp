require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./model/Message'); // Your Message model
const Conversation = require('./model/Conversation'); // Your Conversation model
const User = require('./model/User');

const PORT = process.env.PORT || 3500;
const app = express();

connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  '/uploads/profiles',
  express.static(path.join(__dirname, 'uploads/profiles'))
);

// Route Files - Order matters for route matching
app.use('/api/users', require('./routes/user')); // This should handle /profile
app.use('/api', require('./routes/register'));
app.use('/api', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/profile', require('./routes/update-profile'));
app.use('/api', require('./routes/profiles'));
app.use('/api/apartment', require('./routes/apartmentRoutes'));
app.use('/api/filters', require('./routes/filtersRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api/conversations', require('./routes/conversationRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    msg: 'Server error',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
  });
});

// Socket.io setup
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('chatMessage', async ({ conversationId, senderId, message }) => {
    const sender = await User.findById(senderId).select('username');

    if (!sender) {
      return console.error('Sender not found');
    }
    // Save the message to the database
    const newMessage = new Message({
      conversation: conversationId,
      sender: senderId,
      message: message,
    });

    await newMessage.save();

    // Update the conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message,
      lastMessageTimestamp: Date.now(),
    });

    // Emit the message to all participants in the conversation
    io.to(conversationId).emit('message', {
      _id: newMessage._id,
      sender: { _id: senderId, username: sender.username },
      message: message,
      timestamp: newMessage.timestamp,
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

mongoose.connection.once('open', () => {
  console.log('Connected To MongoDB');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
