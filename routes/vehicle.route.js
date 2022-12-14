const router = require('express').Router();
const VehicleController = require('../controllers/vehicle.controller');

const { verifyToken } = require('../helpers/helper');

router.get('/', VehicleController.getSlots)

router.get('/:vehicleId', VehicleController.getSlotsById)

router.post('/', VehicleController.bookSlot)

module.exports = router