const UserFlightInfo = require('../models/UserFlightInfo')
const InfoUser = require('../models/InfoUser')
const Flight = require('../models/Flight')

const getListUserFlightInfo = async(req, res) => {
    await UserFlightInfo
        .find({})
        .populate('idFlight userInfo purchaser')
        .then(result => {
            res
                .status(200)
                .json(result)
        })
}

const setFlightInfo = async(req, res) => {
    const {idFlight, userInfo, purchaser, service} = req.body
    const trader = req.body.trader != null ? req.body.trader : false
    const newFlightInfo = new UserFlightInfo({
        idFlight,
        userInfo,
        purchaser,
        service,
        trader
    })
    await newFlightInfo.save()
    await updateSettingFlight(idFlight, trader)
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