const { config } = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv')/config()
const bodyParser = require('body-parser')
const cors = require('cors')
const userAccountRoutes = require('./api/routes/userAccounts')
const flightRoutes = require('./api/routes/flights')
const infoUserRoutes = require('./api/routes/infoUsers')
const InfoUser = require('./api/models/InfoUser')
const app = express()

// Access database

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.DB_CONNECTION, 
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true
            }    
        )
    console.log(" MongoDB connected")   
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    } 
}
connectDB()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// handle request 
app.use('/api/user-accounts', userAccountRoutes)     
app.use('/api/flights', flightRoutes)
app.use('/api/info-users', infoUserRoutes)



// Create server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    let curDate = new Date()
    console.log(`App listening port as ${PORT} - Time: `+ curDate)
})

