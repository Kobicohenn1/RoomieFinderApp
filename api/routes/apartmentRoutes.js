const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const apartmentController = require('../controllers/apartmentController');
const auth = require('../middleware/auth');

router.post(
  '/upload',
  auth,
  upload.array('apartmentImages', 5),
  apartmentController.uploadApartmentImages
);

router.post(
  '/upload-details',
  auth,
  apartmentController.uploadApartmentDetails
);

router.get('/:id', auth, apartmentController.getApartmentData);

router.delete(
  '/image/:imageName',
  auth,
  apartmentController.deleteApartmentImage
);

module.exports = router;
