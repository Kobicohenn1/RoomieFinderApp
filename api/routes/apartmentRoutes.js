const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const apartmentController = require('../controllers/apartmentController');
const auth = require('../middleware/auth');

// Upload apartment images
router.post(
  '/upload',
  auth,
  upload.array('apartmentImages', 5),
  apartmentController.uploadApartmentImages
);

// Save apartment details
router.post(
  '/upload-details',
  auth,
  apartmentController.uploadApartmentDetails
);

// Get apartment info
router.get('/:id', auth, apartmentController.getApartmentData);

// Delete apartment image
router.delete(
  '/image/:imageName',
  auth,
  apartmentController.deleteApartmentImage
);

module.exports = router;
