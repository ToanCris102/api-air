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
    numberSeatting: {
        type: Number,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InfoUser'
    },
    createAt: {
        type: Date,
        default: Date.now()
    }

})