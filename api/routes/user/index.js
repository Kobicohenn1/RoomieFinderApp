const express = require('express');
const router = express.Router();

router.use('/profile', require('./profileRoutes'));
router.use('/', require('./userRoutes'));

module.exports = router;
