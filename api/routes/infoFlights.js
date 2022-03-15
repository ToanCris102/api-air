const express = require('express')
const router = express.Router()
const UserFlightInfo = require('../models/UserFlightInfo')
const infoFlightController = require('../controllers/infoFlights')

// @path /info-flight
// @desc show all data ve flight and user
// @accesss Public
router.get('/', infoFlightController.getListUserFlightInfo)