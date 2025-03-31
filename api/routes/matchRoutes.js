const express = require('express');
const router = express.Router();
const { likeUser } = require('../controllers/matchController');
const auth = require('../middleware/auth');

router.post('/like', auth, likeUser);

module.exports = router;
