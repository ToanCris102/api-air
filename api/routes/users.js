const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const User = require('../models/User')
const userMiddleware = require('../middleware/userMiddleware')

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
router.post('/signup',[userMiddleware.checkSignUp] , async (req, res) => {
    const {userName, userPassword, userEmail, userPhoneNumber, identificationCard} = req.body
    try {
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
router.post('/login',[userMiddleware.checkLogin] , async(req, res) => {
    const { identificationCard, userPassword} = req.body
    try {
        //Check for existing user
        const user = await User.findOne({ identificationCard })
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

// @Path api/users/delete
// @Desc Delete data for User
// @Access private
router.delete('/delete/:id', async(req, res) => {
    const id = req.params.id
    if(!id)
        return res
                .status(400)
                .json({
                    success: false,
                    message: "Missing necessary information"
                })
    try {
        await User.findByIdAndDelete({_id: id})
                    .then(result => {
                        res.json({
                            success: true,
                            message: "User delete successfully",
                            request: {
                                type: 'POST',
                                url: 'http://localhost:9000/api/users'
                            }
                        })
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

module.exports = router