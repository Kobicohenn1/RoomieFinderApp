const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filtersController');
const auth = require('../middleware/auth');

router.post('/upload', auth, filterController.uploadFiltersDetails);

router.get('/:id', auth, filterController.getFilterData);

module.exports = router;
