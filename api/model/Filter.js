const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FiltersSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  roommateFilters: {
    gender: {
      type: String,
      enum: ['Female', 'Male', 'All'],
      default: 'All',
    },
    ageRange: {
      type: [Number],
      default: [18, 35],
    },
    smokingHabit: {
      type: String,
      enum: ['Yes', 'No', 'Outside Only'],
    },
    occupation: {
      type: String,
      enum: ['Study', 'Work', 'Both'],
    },
  },
  roomFilters: {
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
    houseRules: {
      type: [String],
      enum: ['Smoker Friendly', 'Pet Friendly', 'Shabbat Observance'],
      default: [],
    },
  },
});

const Filter = mongoose.model('Filter', FiltersSchema);
module.exports = Filter;
