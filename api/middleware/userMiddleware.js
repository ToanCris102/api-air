const jwt = require('jsonwebtoken')
const UserAccount = require('../models/UserAccount')
const Role = require('../models/Role')

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    console.log("Day la token ne: " + token)
    if(!token)
        return res
                //.status(401)
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
    const {userName, userPassword, userEmail, userPhoneNumber, identificationCard, dateOfBirth } = req.body
    if(!userName || !userPassword || !userEmail || !userPhoneNumber || !identificationCard || !dateOfBirth)
        return res
                .status(400)
                .json({ 
                    success: false,
                    message: 'Missing UserName and/or UserPassword, Email, IdentificationCard, !!!'
                })
    const user = await UserAccount.findOne({ identificationCard })
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
                    message: 'Missing Identification Card or/and Password --checkLogin'
                })
        //Check for existing user
    const user = await UserAccount.findOne({ identificationCard })
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
        if (!ROLES.includes(req.body.roles)) {
            res.status(400).send({
                message: `Failed! Role ${req.body.roles} does not exist!`
            });
            return;
        }
    }
    next()
}



module.exports = {
    checkSignUp,
    checkLogin,
    checkRolesExisted,
    verifyToken
}