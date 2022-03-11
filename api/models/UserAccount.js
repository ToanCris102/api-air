const mongoose = require('mongoose')

const userAccountSchema = mongoose.Schema({
    identificationCard: {
        type: String,
        required: true,
        unique: true,
        match: /\d{9}/   
    },
    userPassword: {
        type: String,
        required: true
    },
    userName: {
        type: {
            suffix: String,
            firstName: String,
            lastName: String
        },
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    userPhoneNumber: {
        type: String,
        required: true,
        match: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/
    },    
    userEmail: {
        type: String,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,        
        ref: 'Role',     
        default: "6227a0855580184876a6b641"
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('UserAccount', userAccountSchema)