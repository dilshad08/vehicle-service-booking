const router = require('express').Router();
const VehicleController = require('../controllers/vehicle.controller');

const { verifyToken } = require('../helpers/helper');

router.get('/', VehicleController.getSlots)

router.post('/book/:id', verifyToken, VehicleController.bookSlot)

module.exports = router