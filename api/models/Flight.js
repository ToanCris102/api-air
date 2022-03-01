const mongoose = require('mongoose')



const flightSchema = new mongoose.Schema({
    airCode: {
        type: String,
        required: true,
        unique: true        
    },
    airline: {
        type: String,
        required: true
    },
    departure: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    seatting: {
        type: Array,
        required: true,
    },
    percentage: {
        type: Number,
        default: 3000
    }

})

module.exports = mongoose.model('Flight', flightSchema)