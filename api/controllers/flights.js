const Flight = require('../models/Flight')
const AirportName = require('../models/AirportName')
const { json } = require('express/lib/response')
const getListFlight = async (req, res) => {
    await Flight
            .find({})
            .populate('departure destination')
            .then(result => {
                res
                    .status(200)
                    .json(
                        result
                    )
            })
}

const getFlight = async (req, res) => {
    const id = req.params.id
    await Flight
            .find({_id: id})
            .populate('departure destination')
            .then(result => {
                res
                    .status(200)
                    .json(
                        result
                    )
            })
}
const setFlight = async(req, res) => {
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
        const flight = await Flight.findOne({ airCode })
        if(flight)
            return res
                    .status(400)
                    .json({ 
                        success: false,
                        message: 'Flight already exists'
                    })
        const airNameDeparture = await AirportName.findOne({id: departure})      
        const airNameDestination = await AirportName.findOne({id: destination})
        if(!airNameDeparture && !airNameDestination)
            return res
                        .status(400)
                        .json({ 
                            success: false,
                            message: 'Airport Name dont already exists'
                        })
        const _idDeparture = (airNameDeparture._id).toString()
        const _idDestination = (airNameDestination._id).toString()
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
            departure: _idDeparture,
            destination: _idDestination,
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
}

const updateFlight = async(req, res) => {
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
        const flight = await Flight.findOne({ airCode })
        if(!flight)
            return res
                    .status(400)
                    .json({ 
                        success: false,
                        message: 'Flight does not exist'
                    })
        const airNameDeparture = await AirportName.findOne({id: departure})      
        const airNameDestination = await AirportName.findOne({id: destination})
            return res
                        .status(400)
                        .json({ 
                            success: false,
                            message: 'Airport Name dont already exists'
                        })
        const _idDeparture = (airNameDeparture._id).toString()
        const _idDestination = (airNameDestination._id).toString()
        // All fine
        const newFlight = {
            airCode,
            airName,
            departure: _idDeparture,
            destination: _idDestination,
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

}

const deleteFlight = async(req, res) => {
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

}

const findFlights = async(req, res) => {
    const { origin, destination, departDate, quantityPassenger } = req.params
    const airNameDeparture = await AirportName.findOne({id: origin})      
    const airNameDestination = await AirportName.findOne({id: destination})
    if(!airNameDeparture && !airNameDestination)
        return res
                    .status(400)
                    .json({ 
                        success: false,
                        message: 'Airport Name dont already exists'
                    })
    const _idDeparture = (airNameDeparture._id).toString()
    const _idDestination = (airNameDestination._id).toString()
    const ob = []
    const flightDeparture = await Flight.find({
        departure: _idDeparture,
        destination: _idDestination        
    })
    .select('-__v')
    .populate('departure destination', '-__v')
    .then(result => {
        result.map(element => {
            const date = new Date(departDate)
            // console.log(date.toLocaleDateString())
            // console.log(element.departureTime.toLocaleDateString())
            const dbDate = new Date(element.departureTime.toLocaleDateString())
            const reqDate = new Date(date.toLocaleDateString())
            if(element.seatting[0] >= quantityPassenger || element.seatting[1] >= quantityPassenger )
                if(dbDate.getTime() == reqDate.getTime()){               
                    ob.push(element)
                }            
        })
        return res.json(ob)
    })

}

module.exports = { 
    getListFlight,
    getFlight,
    setFlight,
    updateFlight,
    deleteFlight,
    findFlights
}