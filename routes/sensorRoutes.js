const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.post('/', sensorController.createSensor);
router.get('/', sensorController.getSensors);
router.get('/:id', sensorController.getSensorById);
router.delete('/:id', sensorController.deleteSensor);

module.exports = router;
