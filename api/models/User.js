const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    identificationCard: {
        type: String,
        required: true,
        unique: true
    },
    userPhoneNumber: {
        type: String,
        required: true,
        match: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/
    },
    userPassword: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', userSchema)