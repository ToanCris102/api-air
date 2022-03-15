const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    codeService: {
        type: String,
        required: true
    },
    
})

module.exports = mongoose.model('Service', serviceSchema)