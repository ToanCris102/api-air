const express = require('express')
const { find } = require('../models/User')
const router = express.Router()
const UserFlightInfo = require('../models/UserFlightInfo')

// @path /info-flight
// @desc show all data ve flight and user
// @accesss Public
router.get('/', (req, res) => {
    UserFlightInfo
        .find({})
        .then(result => {
            res
                .status(200)
                .json(result)
        })
})