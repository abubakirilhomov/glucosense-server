const express = require('express');
const router = express.Router();
const carbController = require('../controllers/carbController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.post('/', carbController.createCarbLog);
router.get('/', carbController.getCarbLogs);
router.delete('/:id', carbController.deleteCarbLog);

module.exports = router;
