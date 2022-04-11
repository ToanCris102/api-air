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

// @path /info-flight/status/set
// @desc set status and send mail for user
// @accesss private role = admin
router.post('/status/set', infoFlightController.setStatusFlightAndMail)


router.post('/mail', infoFlightController.sendMail)

router.post('/send-code', infoFlightController.sendCodeAndMail)

router.post('/check-code', infoFlightController.checkCode)

router.get('/render-list-user/:airCode', infoFlightController.renderListCustomer)

router.post('/check-password-token', infoFlightController.checkPasswordToSetStatus)

module.exports = router