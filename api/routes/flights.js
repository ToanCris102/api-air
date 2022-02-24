const express = require('express')
const router = express.Router()
const Flight = require('../models/Flight')



router.get('/', (req, res) => {
    res
        .status(200)
        .json({
            message: "Flights get api"
        })
})

// @Path api/flights/add
// @Desc Insert data for Flight 
// @Access private
router.post('/add', async(req, res) => {
    const {airCode, airline, departure, destination, departureTime} = req.body
    // Check input
    if(!airCode || !airline || !departure || !destination || !departureTime)
        return res
                .status(400)
                .json({
                    success: false,
                    message: "Missing necessary information"
                })
    try {
        // Check for existing
        const flight = Flight.findOne({ airCode })
        if(!flight.length)
            return res
                    .status(400)
                    .json({ 
                        success: false,
                        message: 'Flight already exists'
                    })
        // All fine
        const newFlight = new Flight({
            airCode,
            airline,
            departure,
            destination,
            departureTime
        })
        await newFlight.save()

        res.json({
            success: true,
            message: "Flight created successfully",
            flight: newFlight
        })
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json({
                success: false,
                message: 'Internal server error!!!'
            })
    }
})

module.exports = router