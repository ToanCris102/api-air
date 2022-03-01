const express = require('express')
const router = express.Router()
const Flight = require('../models/Flight')


// @Path api/flights/
// @Desc show list data for Flight 
// @Access public
router.get('/', (req, res) => {
    Flight
            .find({})
            .then(result => {
                res
                    .status(200)
                    .json(
                        result
                    )
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
        if(!flight)
            return res
                    .status(400)
                    .json({ 
                        success: false,
                        message: 'Flight already exists'
                    })
        // All fine
        const seatting = new Array(100)
        for(let n=0; n < 100; n++){
            seatting[n] = 0
        }
        const newFlight = new Flight({
            airCode,
            airline,
            departure,
            destination,
            departureTime,
            seatting
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


// @Path api/flights/update
// @Desc Update data for Flight 
// @Access private
router.put('/update/:id', async(req, res) => {
    const {airCode, airline, departure, destination, departureTime, seatting} = req.body
    const id = req.params.id
    if(!airCode || !airline || !departure || !destination || !departureTime || !seatting || !id)
        return res
                .status(400)
                .json({
                    success: false,
                    message: "Missing necessary information",
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/flights'
                    }
                })
    try {
        // Check for existing
        const flight = Flight.findOne({ airCode })
        if(!flight)
            return res
                    .status(400)
                    .json({ 
                        success: false,
                        message: 'Flight does not exist'
                    })
        // All fine
        const newFlight = {
            airCode: airCode,
            airline: airline,
            departure: departure,
            destination: destination,
            departureTime: departureTime,
            seatting: seatting
        }
        await Flight.findByIdAndUpdate({_id: id}, newFlight, {new: true})
                    .then(result => {
                        res.json({
                            success: true,
                            message: "Flight updated successfully",
                            flight: result
                        })
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

// @Path api/flights/delete
// @Desc Delete data for Flight 
// @Access private
router.delete('/delete/:id', async(req, res) => {
    const id = req.params.id
    if(!id)
        return res
                .status(400)
                .json({
                    success: false,
                    message: "Missing necessary information"
                })
    try {
        await Flight.findByIdAndDelete({_id: id})
                    .then(result => {
                        res.json({
                            success: true,
                            message: "Flight delete successfully",
                            request: {
                                type: 'POST',
                                url: 'http://localhost:3000/api/flights'
                            }
                        })
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