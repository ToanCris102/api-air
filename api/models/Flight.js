const mongoose = require('mongoose')

const flightSchema = new mongoose.Schema({
    airCode: {
        type: String,
        required: true,
        unique: true
    },
    airName: {
        type: String,
        required: true
    },
    departure: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AirportName'
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AirportName'
    },
    departureTime: {
        type: Date,
    },
    timeTemp: {
        hour: {
            type: Number,
            required: true
        },
        minute: {
            type: Number,
            required: true
        }      
    },
    seatting: {
        type: Array,
        default: [50,50]
    },
    percentage: {
        tax: {
            type: Number,
            default: 1
        },
        business: {
            type: Number,
            default: 1
        }
    },
    price: {
        type: Number,
        required: true    
    },
    status: {
        type: Boolean,
        default: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Flight', flightSchema)