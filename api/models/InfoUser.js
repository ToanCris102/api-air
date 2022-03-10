const mongoose = require('mongoose')

const infoUserSchema = mongoose.Schema({
    identificationCard: {
        type: String,
        required: true,
        match: /\d{9}/   
    },
    userName: {
        type: {
            suffix: {
                type: String,
                required: true
            },
            firstName: {
                type: {
                    type: String,
                    required: true
                }
            },
            lastName: {
                type: {
                    type: String,
                    required: true
                }
            }
        },
        required: true
    },
    dateOfBirth: {
        type: Date(),
        required: true
    },
    userPhoneNumber: {
        type: String,
        match: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/
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

module.exports = mongoose.model('InfoUser', infoUserSchema)