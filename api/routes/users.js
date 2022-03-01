const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const User = require('../models/User')

// router temp
router.get('/', (req, res) => {
    User.find({})
        .then(result => {
            res
            .status(200)
            .send(result)
        })
})

// @route POST /signup
// @desc Signup User
// @access Public
router.post('/signup', async (req, res) => {
    const {userName, userPassword, userEmail, userPhoneNumber, identificationCard} = req.body
    //Vadilation
    if(!userName || !userPassword || !userEmail || !userPhoneNumber || !identificationCard){
        return res
                .status(400)
                .json({ 
                    success: false,
                    message: 'Missing UserName and/or UserPassword, Email, IdentificationCard!!!'
                })
    }
    try {
        // Check for existing
        const user = User.findOne({ identificationCard })
        if(user) {
            return res
                    .status(400)
                    .json({ 
                        success: false,
                        message: 'User email already taken'
                    })
        }
        // After check
        const hashedPassword = await argon2.hash(userPassword)
        const newUser = new User({
            identificationCard,
            userName: userName,
            userPhoneNumber: userPhoneNumber,
            userPassword: hashedPassword,
            userEmail: userEmail
        })
        await newUser.save()
                    
        // Return token by use jsonwebtoken
        const accessToken = jwt.sign(
                                { userId: newUser._id }, 
                                process.env.ACCESS_TOKEN_SECRET
                            )
        res.json({
            success: true,
            message: 'User created successfully',
            accessToken
        })
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json({
                success: false,
                message: 'Internal server error!!!'
            })
    }
})

// @route /login
// @desc Login User
// @access Public
router.post('/login', async(req, res) => {
    const { identificationCard, userPassword} = req.body
    //Vadilation
    if(!userPhoneNumber || !identificationCard)
        return res
                .status(400)
                .json({
                    success: false,
                    message: 'Missing Identification Card or/and Password 1'
                })
    try {
        //Check for existing user
        const user = await User.findOne({ identificationCard })
        if(!user)
            return res
                    .status(401)
                    .json({
                        success: false,
                        message: "Incorrect Identification Card and/or Password"
                    })
        // after check 
        const passwordValid = await argon2.verify(user.userPassword, userPassword)
        if(!passwordValid)
            return res
                    .status(400)
                    .json({
                        success: false,
                        message: 'Incorrect Identification Card or/and Password'
                    })
        // All good, Return token by use jsonwebtoken
        const accessToken = jwt.sign(
                                { userId: user._id },
                                process.env.ACCESS_TOKEN_SECRET
                            )
        res.json({ 
            success: true, 
            message: 'User logged in successfully', 
            accessToken 
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

module.exports = router