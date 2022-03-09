const mongoose = require('mongoose')

const UserFlightInfoSchema = new mongoose.Schema({
    idFlight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    identificationCard: {
        type: [mongoose.Schema.identificationCard],
        ref: 'User',
        required: true
    },
    numberSeatting: {
        type: Number,
        required: true
    },
    cost: {
        type: String,
        required: true
    }
})