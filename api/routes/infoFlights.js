const express = require('express')
const router = express.Router()
const UserFlightInfo = require('../models/UserFlightInfo')

// @path /info-flight
// @desc show all data ve flight and user
// @accesss Public
router.get('/', async(req, res) => {
    await UserFlightInfo
        .find({})
        .then(result => {
            res
                .status(200)
                .json(result)
        })
})