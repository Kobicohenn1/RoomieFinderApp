const { default: axios } = require('axios');
const Apartment = require('../model/Apartment');
const User = require('../model/User');
const fs = require('fs');
const path = require('path');

// Function for uploading image URLs to the database
exports.uploadApartmentImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Initialize the apartment field if it doesn't exist
    if (!user.apartment) {
      const apartment = new Apartment({
        owner: user._id,
        images: [],
      });
      await apartment.save();
      user.apartment = apartment._id;
      await user.save();
    }

    const apartment = await Apartment.findById(user.apartment);
    if (!apartment) {
      return res.status(404).json({ msg: 'Apartment not found' });
    }

    const filePaths = req.files.map(
      (file) => `uploads/apartments/${file.filename}`
    );
    apartment.images = [...apartment.images, ...filePaths];

    await apartment.save();
    res.json({ msg: 'Apartment Images uploaded successfully', filePaths });
  } catch (error) {
    console.error('Error Uploading Apartment Image', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.getApartmentData = async (req, res) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      res.status(404).json({ msg: 'apartment not found' });
    }
    res.json(apartment);
  } catch (error) {
    console.log('Error fetch user', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.deleteApartmentImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { imageName } = req.params;
    console.log(userId);
    const apartment = await Apartment.findOne({ owner: userId });
    console.log(apartment);

    if (!apartment) {
      return res.status(404).json({ msg: 'Apartment dont found.' });
    }

    const imagePath = path.join('uploads', 'apartments', imageName);
    const imageIndex = apartment.images.findIndex((image) =>
      image.includes(imageName)
    );
    if (imageIndex === -1) {
      return res.status(404).json({ msg: 'Image not found' });
    }
    apartment.images.splice(imageIndex, 1);
    await apartment.save();

    fs.unlink(imagePath, (error) => {
      if (error) {
        console.error('Error deleting image file', error);
      }
    });
    res.json({ msg: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

exports.uploadApartmentDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Initialize the apartment field if it doesn't exist
    if (!user.apartment) {
      const apartment = new Apartment({
        owner: user._id,
        ...req.body,
      });
      await apartment.save();
      user.apartment = apartment._id;
      await user.save();
      return res.json(apartment);
    }

    const apartment = await Apartment.findById(user.apartment);
    if (!apartment) {
      return res.status(404).json({ msg: 'Apartment not found' });
    }

    // Update the apartment details
    Object.assign(apartment, req.body);
    await apartment.save();
    res.json(apartment);
  } catch (error) {
    console.error('Error uploading apartment details:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
