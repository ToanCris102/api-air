const express = require('express')
const router = express.Router()
const UserFlightInfo = require('../models/UserFlightInfo')
const infoFlightController = require('../controllers/infoFlights')

// @path /info-flight
// @desc show all data ve flight and user
// @accesss Public
router.get('/', infoFlightController.getListUserFlightInfo)

// @path /info-flight/id
// @desc show all data ve flight and user
// @accesss Public
router.get('/:id', infoFlightController.getUserFlightInfo)

// @path /info-flight/add
// @desc add all data ve flight and user
// @accesss public
router.post('/add', infoFlightController.setFlightInfo)

module.exports = router