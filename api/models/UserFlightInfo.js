const mongoose = require('mongoose')

const UserFlightInfoSchema = new mongoose.Schema({
    airCode: {
        type: mongoose.Schema.airCode,
        ref: 'Flight',
        required: true
    },
    identificationCard: {
        type: mongoose.Schema.identificationCard,
        ref: 'User',
        required: true
    },
    numberSeatting: {
        type: Array,
        required: true
    },
    cost: {
        type: String,
        required: true
    }
})