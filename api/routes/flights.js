const express = require('express')
const router = express.Router()
const Flight = require('../models/Flight')
const flightController = require('../controllers/flights')


// @Path api/flights/
// @Desc show list data for Flight 
// @Access public
router.get('/', flightController.getListFlight)

// @Path api/flights/
// @Desc show list data for Flight 
// @Access public
router.get('/:id', flightController.getFlight)

// @Path api/flights/add
// @Desc Insert data for Flight 
// @Access private
router.post('/add', flightController.setFlight)


// @Path api/flights/update
// @Desc Update data for Flight 
// @Access private
router.put('/update/:id', flightController.updateFlight)

// @Path api/flights/delete
// @Desc Delete data for Flight 
// @Access private
router.delete('/delete/:id', flightController.deleteFlight)


module.exports = router