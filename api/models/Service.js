const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    codeService: {
        type: String,
        required: true
    },
    health: {
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
        LG020: {
            type: Number,
            default: 0
        }
    }
    
})

module.exports = mongoose.model('Service', serviceSchema)