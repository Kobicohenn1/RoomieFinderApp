const mongoose = require('mongoose');
const { validate } = require('./User');
const Schema = mongoose.Schema;

const FiltersSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  gender: {
    type: String,
    enum: ['Female', 'Male', 'All'],
    default: 'All',
  },
  ageRange: {
    type: [Number],
    default: [18, 35],
  },
  pricingRange: {
    type: [Number],
    default: [500, 3000],
  },
  sharingOption: {
    type: String,
    enum: ['Any', '1', '2', '3', '4+'],
    default: 'Any',
  },
  city: {
    type: String,
    trim: true,
  },
});

const Filter = mongoose.model('Filter', FiltersSchema);
module.exports = Filter;
