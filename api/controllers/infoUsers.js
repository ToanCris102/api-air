const InfoUser = require('../models/InfoUser')

const getListInfoUser = async (req, res) => {
    await InfoUser.find({})
        .then(result => {
            const respone = {
                count: result.length,
                users: result.map(doc => {
                    return {
                        User: doc,
                        request: {
                            type: 'GET',
                            url: "http://localhost:9000/api/info-user/" + doc._id
                        }
                    }
                })
            }
            res
                .status(200)
                .json(respone)
        })
}

const getInfoUser = async (req, res) => {
    const id = req.params.id
    await InfoUser.findById({_id: id})
        .then(result => {
            res
            .status(200)
            .send(result)
        })
}

const setInfoUser = async (req, res) => {
    const {userName, identificationCard, dateOfBirth, userPhoneNumber, userEmail} = req.body
    if(!userName || !identificationCard || !dateOfBirth)
        return res
                .status(400)
                .json({ 
                    success: false,
                    message: 'Missing of information !!!'
                })
    try {      
        if(userPhoneNumber && userEmail){
            const newUser = new InfoUser({
                identificationCard,
                userName,
                dateOfBirth,
                userPhoneNumber,            
                userEmail
            })    
            await newUser.save()
        }else {
            const newUser = new InfoUser({
                identificationCard,
                userName,
                dateOfBirth
            })
            await newUser.save()
        }        
        res.json({
            success: true,
            message: 'User Information added',
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

const updateInfoUser = async (req, res) => {
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

const deleteInfoUser = async(req, res) => {
    const id = req.params.id
    if(!id)
        return res
                .status(400)
                .json({
                    success: false,
                    message: "Missing necessary information"
                })
    try {
        await InfoUser.findByIdAndDelete({_id: id})
                    .then(result => {
                        res.json({
                            success: true,
                            message: "User Information delete successfully",
                            request: {
                                type: 'POST',
                                url: 'http://localhost:9000/api/info-users'
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
    getListInfoUser,
    getInfoUser,
    setInfoUser,
    updateInfoUser,
    deleteInfoUser
}