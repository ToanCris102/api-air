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
    const { airCode, airName, departure, destination, departureTime, timeTemp, price} = req.body
    // airCode mã chuyến bay, airName: tên chuyến bay, departure: điểm đi, destination: điểm đến,
    // departureTime: giờ khởi hành, timeTemp: giờ dự kiến, price: giá chuyến bay 
    // Check input
    if(!airCode || !airName || !departure || !destination || !departureTime || !timeTemp || !price)
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
        const seatting = new Array(2)
        for(let n=0; n < 2; n++){
            seatting[n] = 50
        }
        const newTime = new Date()
        //newTime.toLocaleDateString date not time
        //newTime.toLocaleTimeString time not date
        // newTime.toString() convert a date object to a string
        const newFlight = new Flight({
            airCode,
            airName,
            departure,
            destination,
            departureTime,
            timeTemp,
            seatting,
            price
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
    const { airCode, airName, departure, destination, departureTime, timeTemp, price} = req.body
    const id = req.params.id
    if(!airCode || !airName || !departure || !destination || !departureTime || !timeTemp || !price)
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
                        message: 'Flight does not exist'
                    })
        // All fine
        const newFlight = {
            airCode,
            airName,
            departure,
            destination,
            departureTime,
            timeTemp,
            price,
            seatting
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