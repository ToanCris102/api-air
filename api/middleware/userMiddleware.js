const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Role = require('../models/Role')

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    console.log("Day la token ne: " + token)
    if(!token)
        return res
                .status(401)
                .json({
                    success: false,
                    messsage: 'Access token not found'
                })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log(error)
        return res
                .status(403)
                .json({
                    success: false,
                    message: 'Invalid token'
                })
    }
}



const checkSignUp = async (req, res, next)=> {
    const {userName, userPassword, userEmail, userPhoneNumber, identificationCard} = req.body
    if(!userName || !userPassword || !userEmail || !userPhoneNumber || !identificationCard)
        return res
                .status(400)
                .json({ 
                    success: false,
                    message: 'Missing UserName and/or UserPassword, Email, IdentificationCard!!!'
                })
    const user = await User.findOne({ identificationCard })
    if(user)
        return res
                .status(400)
                .json({ 
                    success: false,
                    message: 'IdentificationCard already exists'
                })
    next()
}

const checkLogin = async (req, res, next)=> {
    const { identificationCard, userPassword} = req.body
    //Vadilation
    if(!identificationCard || !userPassword)
        return res
                .status(400)
                .json({
                    success: false,
                    message: 'Missing Identification Card or/and Password 1'
                })
        //Check for existing user
    const user = await User.findOne({ identificationCard })
    if(!user)
        return res
                .status(401)
                .json({
                    success: false,
                    message: "Incorrect Identification Card and/or Password"
                })
    next()
}

const checkRolesExisted = async (req, res) => {
    const ROLES = []
    await Role.find({}).then(result => {
        result.map(t => {
        ROLES.push(t.name)
    })})
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                });
                return;
            }
        }
    }
}



module.exports = {
    checkSignUp,
    checkLogin,
    checkRolesExisted,
    verifyToken
}