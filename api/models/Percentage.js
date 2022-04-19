const mongoose = require('mongoose')

const percentageSchema = new mongoose.Schema({    
    
        tax: {
            type: Number,
            default: 1
        },
        business: {
            type: Number,
            default: 1
        },
    
    createAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Percentage', percentageSchema)