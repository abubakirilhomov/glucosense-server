const express = require('express');
const router = express.Router();
const readingController = require('../controllers/readingController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.get('/', readingController.getReadings);
router.post('/', readingController.createReading);
router.get('/latest', readingController.getLatestReading);
router.get('/chart', readingController.getChartData);

module.exports = router;
