const AirportName = require('../models/AirportName')

const getListAirportName = async (req, res) => {    
    try {
        await AirportName
        .find({})
        .select('-__v -_id')
        .then(result => {
            res
                .status(200)
                .json({
                    success: true,
                    result: result
                })
        })    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}



const getAirportName = async (req, res) => {
    const id = req.params.id    
    try {
        await AirportName
        .find({id: id})
        .select('-__v -_id')
        .then(result => {
            res
                .status(200)
                .json({
                    success: true,
                    result: result
                })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
    
}

const setAirportName =  async(req, res) => {
    const {id, name} = req.body   
    try {
        const newAirportName = new AirportName({
            id,
            name
        })
        await newAirportName.save()
        res.json({
            success: true,
            message: "Airport name created successfully",
            airportName: newAirportName
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

module.exports = {
    getListAirportName,
    getAirportName,
    setAirportName
}