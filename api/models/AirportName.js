const mongoose = require('mongoose')

const airportNameSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('AirportName', airportNameSchema)