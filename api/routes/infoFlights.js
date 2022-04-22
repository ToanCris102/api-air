const express = require('express')
const router = express.Router()
const userMiddleware = require('../middleware/userMiddleware')
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
router.post('/status/set',  infoFlightController.setStatusFlightAndMail)
// [userMiddleware.checkRoleAdmin],
// @path /info-flight/check-password-token
// @desc check password
// @accesss private role = admin
router.post('/check-password-token', [userMiddleware.checkRoleAdmin], infoFlightController.checkPasswordToSetStatus)

router.post('/mail', infoFlightController.sendMail)

// @path /info-flight/send-code
// @desc send the code to check when user buy
// @accesss private public
router.post('/send-code', infoFlightController.sendCodeAndMail)

// @path /info-flight/check-code
// @desc send the code to user email for check buy the ticket
// @accesss public
router.post('/check-code', infoFlightController.checkCode)

// @path /info-flight/render-list-user
// @desc show list users of the flight
// @accesss private role = admin
router.get('/render-list-user/:airCode',  infoFlightController.renderListCustomer)
//[userMiddleware.checkRoleAdmin],


module.exports = router