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
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    departureTime: {
        type: Date,
        // hour: {
        //     type: String,
        //     required: true
        // },
        // minute: {
        //     type: String,
        //     required: true
        // }
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
    }


})

module.exports = mongoose.model('Flight', flightSchema)