const express = require('express')
const router = express.Router()
const Flight = require('../models/Flight')
const userMiddleware = require('../middleware/userMiddleware')
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
// @Access private for admin
router.post('/add', [userMiddleware.checkRoleAdmin], flightController.setFlight)


// @Path api/flights/update
// @Desc Update data for Flight 
// @Access private for admin
router.put('/update/:id', [userMiddleware.checkRoleAdmin], flightController.updateFlight)

// @Path api/flights/delete
// @Desc Delete data for Flight 
// @Access private for admin
router.delete('/delete/:id', [userMiddleware.checkRoleAdmin], flightController.deleteFlight)

// @Path api/flights/findFlight
// @Desc find flight for 
// @Access public
router.get('/find/:origin/:destination/:departDate/:quantityPassenger', flightController.findFlights)
// @demo http://localhost:9000/api/flights/find/SGN/HAN/Sat Mar 05 2022 01:33:41 GMT+0700 (Indochina Time)/3

module.exports = router