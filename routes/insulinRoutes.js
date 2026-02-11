const express = require('express');
const router = express.Router();
const insulinController = require('../controllers/insulinController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.post('/', insulinController.createInsulinLog);
router.get('/', insulinController.getInsulinLogs);
router.delete('/:id', insulinController.deleteInsulinLog);

module.exports = router;
