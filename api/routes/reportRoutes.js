const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.post('/report', auth, reportController.sendReportEmail);

router.post('/bug-report',auth,reportController.sendBugReportEmail);

module.exports = router;
