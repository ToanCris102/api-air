const UserFlightInfo = require('../models/UserFlightInfo')
const InfoUser = require('../models/InfoUser')
const Flight = require('../models/Flight')
const Utils = require('./utils')
const AirportName = require('../models/AirportName')

const getListUserFlightInfo = async(req, res) => {
    await UserFlightInfo
        .find({})
        .select('-__V -_id')
        .populate({
            path: 'purchaser',
            select: '-__V'
        })   
        .populate({
            path: 'userInfo',
            select: '-__V'
        })  
        .populate({
            path: 'idFlight',
            select: '-__V',
            populate: {
                path: 'departure destination',
                select: 'name id -_id'
            }
        })   
        .then(result => {
            res
                .status(200)
                .json(result)
        })
}



const setFlightInfo = async(req, res) => {
    const {idFlight, userInfo, purchaser, service} = req.body
   
    const trader = req.body.trader != null ? req.body.trader : false

    const _idFlight = await Flight.findOne({airCode: idFlight})
    const _userInfo = await InfoUser.find({identificationCard: userInfo}).sort({createAt:-1})    
    const _purchaser = await InfoUser.find({identificationCard: purchaser}).sort({createAt:-1})
    const newFlightInfo = new UserFlightInfo({
        idFlight: _idFlight._id,
        userInfo: _userInfo[0]._id,
        purchaser: _purchaser[0]._id,
        service,
        trader
    })
    await newFlightInfo.save()
    await updateSettingFlight(_idFlight._id, trader)
    // const mail = 'toanb1805927@studen.ctu.edu.vn'
    // await Utils.sendMail(mail)
    res.json({
        success: true,
        message: "InfoFlight created successfully",
        flight: newFlightInfo
    })
   
}

const updateSettingFlight = async (id, trader) => {
    const flight = await Flight.findById({_id: id})
    if(flight.seatting[0] > 0 && !trader){
        var numb = [flight.seatting[0] - 1,flight.seatting[1]]        
    }else if(flight.seatting[1] > 0 && trader){
        var numb = [flight.seatting[0], flight.seatting[1] - 1]        
    }
    await Flight.findByIdAndUpdate(
        {_id: id},
        {seatting: numb},
        {new: true}    
    ).then(result => {
        console.log(result)
    })
}

module.exports = {
    getListUserFlightInfo,
    setFlightInfo
}