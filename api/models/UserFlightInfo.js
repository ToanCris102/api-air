const mongoose = require('mongoose')

const UserFlightInfoSchema = new mongoose.Schema({
    idFlight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    userInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InfoUser',
        required: true
    },
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InfoUser'
    },
    service: {
        health: {
            type: Boolean,
            default: false
        },
        crip: {
            type: Boolean,
            default: false
        },
        meal: {
            type: String,
        },
        luggage: {
            LG010: {
                type: Number,
                default: 0
            },
            LG023: {
                type: Number,
                default: 0
            }
        }
    },
    trader: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('UserFlightInfo', UserFlightInfoSchema)