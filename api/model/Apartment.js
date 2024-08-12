const mongoose = require('mongoose');
const { validate } = require('./User');
const Schema = mongoose.Schema;

const ApartmentSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      //required: true,
    },
    address: {
      type: String,
      //required: true,
    },
    city: {
      type: String,
      //required: true,
    },
    numberOfRooms: {
      type: Number,
      //required: true,
    },
    numberOfPeople: {
      female: {
        type: Number,
      },
      male: {
        type: Number,
      },
    },
    rentPrice: {
      type: Number,
      //reuqired: true,
    },
    description: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
    },
    moveInDate: {
      type: Date,
      //required: true,
    },
    houseRules: {
      smokerFriendly: {
        type: Boolean,
        default: false,
      },
      petFriendly: {
        type: Boolean,
        default: false,
      },
      shabbatObservance: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const Apartment = mongoose.model('Apartment', ApartmentSchema, 'apartments');
module.exports = Apartment;
