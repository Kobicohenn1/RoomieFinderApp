const express = require('express');
const router = express.Router();
const { getProfiles } = require('../controllers/profilesController');

// GET /api/profiles
router.get('/profiles', getProfiles);

module.exports = router;
