const { config } = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
require('dotenv')/config()
const bodyParser = require('body-parser')
const userRoutes = require('./api/routes/users')
const flightRoutes = require('./api/routes/flights')

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

// handle request 
app.use('/api/users', userRoutes)     
app.use('/api/flights', flightRoutes)



// Create server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    let curDate = new Date()
    console.log(`App listening port as ${PORT} - Time: `+ curDate)
})

