require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const morgan = require('morgan');

const PORT = process.env.PORT || 3500;
const app = express();

connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', require('./routes/register'));
app.use('/api', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/profile', require('./routes/update-profile'));
app.use('/api', require('./routes/profiles')); // Corrected this line
app.use('/api/apartment', require('./routes/apartmentRoutes'));

mongoose.connection.once('open', () => {
  console.log('Connected To MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT} port`);
  });
});
