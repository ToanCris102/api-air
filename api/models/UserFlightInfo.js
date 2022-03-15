const mongoose = require('mongoose')

const UserFlightInfoSchema = new mongoose.Schema({
    idFlight: {
        type: mongoose.Schema.airCode,
        ref: 'Flight',
        required: true
    },
    userInfo: {
        type: mongoose.Schema.Types.identificationCard,
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
        type: mongoose.Schema.Types.identificationCard,
        ref: 'InfoUser'
    },
    createAt: {
        type: Date,
        default: Date.now()
    }

})