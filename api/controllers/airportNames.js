const AirportName = require('../models/AirportName')

const getListAirportName = async (req, res) => {
    await AirportName
        .find({})
        .select('-__v -_id')
        .then(result => {
            res
                .status(200)
                .json(
                    result
                )
        })
}

const setAirportName =  async(req, res) => {
    const {id, name} = req.body
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
}

module.exports = {
    getListAirportName,
    setAirportName
}