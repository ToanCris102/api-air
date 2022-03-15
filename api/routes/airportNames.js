const express = require('express')
const router = express.Router()
const AirportName = require('../models/AirportName')
const airportNameController = require('../controllers/airportNames')

// @Path /api/airportNames
// @desc show list name of airport
// @access private
router.get('/', airportNameController.getListAirportName);

// @Path /api/airportNames/add
// @desc add name of airport
// @access private
router.post('/add', airportNameController.setAirportName);

module.exports = router