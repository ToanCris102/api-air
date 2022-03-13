const UserAccount = require('../models/UserAccount')
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')

const getListUserAccount = async(req, res) => {
    UserAccount.find({})
        .populate('role')
        .then(result => {
            const respone = {
                count: result.length,
                UserAccounts: result.map(doc => {
                    return {
                        UserAccount: doc,
                        request: {
                            type: 'GET',
                            url: "http://localhost:9000/api/user/" + doc._id
                        }
                    }
                })
            }
            res
                .status(200)
                .json(respone)
        })
}

const getUserAccount = async (req, res) => {
    const id = req.params.id
    UserAccount.findById({_id: id})
        .then(result => {
            res
            .status(200)
            .send(result)
        })
}

const signUp = async (req, res) => {
    const {userName, userPassword, userEmail, userPhoneNumber, identificationCard, dateOfBirth} = req.body
    try {
        const hashedPassword = await argon2.hash(userPassword)        
        const newUser = new UserAccount({
            identificationCard,
            userPassword,
            userName,
            dateOfBirth,
            userPhoneNumber,            
            userEmail
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
}

const logIn = async(req, res) => {
    const { identificationCard, userPassword} = req.body
    try {
        //Check for existing user
        const user = await UserAccount.findOne({ identificationCard })
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
}

const updateUserAccount = async (req, res) => {
    const {userName, identificationCard, dateOfBirth, userPhoneNumber, userEmail} = req.body
    const id = req.params.id
    if(!userName || !identificationCard || !dateOfBirth)
        return res
                .status(400)
                .json({ 
                    success: false,
                    message: 'Missing of information !!!'
                })
    try {      
        if(userPhoneNumber && userEmail){
            const newInfoUser = {
                identificationCard,
                userName,
                dateOfBirth,
                userPhoneNumber,            
                userEmail                
            }
            InfoUser
                .findByIdAndUpdate({_id: id}, newInfoUser, {new: true})  
                .then(result => {
                    res
                        .status(200)
                        .json({
                            success: "true",
                            message: "Updated User Information",
                            InfoUser: result
                        })
                })
        }else {
             const newInfoUser = {
                identificationCard,
                userName,
                dateOfBirth
            }
            InfoUser
                .findByIdAndUpdate({_id: id}, newInfoUser, {new: true})  
                .then(result => {
                    res
                        .status(200)
                        .json({
                            success: "true",
                            message: "Updated User Information",
                            InfoUser: result
                        })
                })
        }        
    } catch (error) {
        console.log(error)
        res
            .status(500)
            .json({
                success: false,
                message: 'Internal server error!!!'
            })
    }
}

const deleteUserAccount = async(req, res) => {
    const id = req.params.id
    if(!id)
        return res
                .status(400)
                .json({
                    success: false,
                    message: "Missing necessary information"
                })
    try {
        await UserAccount.findByIdAndDelete({_id: id})
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
}

module.exports = { 
    getListUserAccount,
    getUserAccount,
    signUp,
    logIn,
    updateUserAccount,
    deleteUserAccount
}