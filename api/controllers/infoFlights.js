const UserFlightInfo = require('../models/UserFlightInfo')
const InfoUser = require('../models/InfoUser')
const Flight = require('../models/Flight')
const Utils = require('./utils')
const AirportName = require('../models/AirportName')

const getListUserFlightInfo = async(req, res) => {
    await UserFlightInfo
        .find({})
        .select('-__V')
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

const getUserFlightInfo = async(req, res) => {
    const id = req.params.id
    await UserFlightInfo
        .findById({_id: id})
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
    res.json({
        success: false,
        message: "Can't find anything"
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
    res.json({
        success: true,
        message: "InfoFlight created successfully",
        flight: newFlightInfo
    })
   
}

const sendMail = async (req, res) => {
    const {purchaser, users, airCode} = req.body
    const tickets = []
    const listId = []
    for (let i in users){
        await UserFlightInfo        
            .find({ })
            .populate({
                path: 'idFlight',
                match: {
                    airCode: airCode
                }   
            })
            .populate({
                path: 'userInfo',
                match: {
                    identificationCard: users[i]
                }   
            })
            .populate({
                path: 'purchaser',
                match: {
                    identificationCard: purchaser
                }   
            })
            .then(result => {
                const temp = result.filter(element => (element.idFlight!=null && element.userInfo!=null && element.purchaser!=null))
                if(temp.length > 0){
                    tickets.push(temp[0])
                    listId.push(temp[0]._id.toString())
                }
                    
            })    
        
    }
    console.log(listId)
    console.log(tickets[0].purchaser.userName.suffix + " "+ tickets[0].purchaser.userName.lastName)
    //res.json(tickets)
    // users.map( async (user) => {
    //     await InfoUser
    //         .find({identificationCard: user})
    //         .sort({createAt:-1})
    //         .then(users => {
    //             const idUser = 
    //             console.log(users[0]._id)
    //         })
    // })
    const title = 'Ticket infomation at ' + Date.now()

    const content = `
        <div style="padding: 5px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h5 style="color: #0085ff">Xin Chào ${tickets[0].purchaser.userName.suffix} ${tickets[0].purchaser.userName.lastName} thông tin về số vé của bạn</h5>
                <p style="color: black">Mã vé: ${listId}</p>
            </div>
        </div>
    `;
    const mail =  tickets[0].purchaser.userEmail//'crisriorock0@gmail.com'
    await Utils.sendMail(mail, content, title)    
    res.json({
        success: true,
        message: "Send mail after ..."
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

const checkPasswordToSetStatus = async (req, res) => {
    const { token, password } = req.body
    const result = await Utils.checkPasswordWithTokenPassword(password, token)
    res.json({
        success: result
    })
}

const setStatusFlightAndMail = async (req, res) => {
    const airCode = req.body.airCode
    await Flight.findOneAndUpdate(
        {airCode: airCode},
        {status: false},
        {new: true}
    ).then( result => {
        const idFlight = result._id
        UserFlightInfo
            .find({idFlight: idFlight})
            .populate('purchaser')
            .then(result => {
                result.map(async user => {
                    console.log(user.purchaser.userEmail)
                    const content = 'Chuyến bay của bạn đã bị hủy thông tin chi tiết xin liên hệ 0123456789'
                    const title = 'Thông báo hủy chuyến bay'
                    //await Utils.sendMail(user.userEmail, content, title)
                })
            })
    })
    res.json({
        message: "update status for Flight and send mail"
    })
}

const sendCodeAndMail = async (req, res) => {
    const {mail} = req.body
    const code = await Utils.createCodeNumber(mail)
    res
        .status(200)
        .json({
            code: code
        })
}

const checkCode = async (req, res) => {
    const { code, encode } = req.body
    const result = await Utils.checkCodeNumber(code, encode)
    res
        .status(200)
        .json({
            success: result
        })
}

const renderListCustomer = async (req, res) => {
    const airCode = req.params.airCode 
    const listUser = []
    await UserFlightInfo        
        .find({ })
        .populate({
            path: 'userInfo'   
        })
        .populate({
            path: 'idFlight',
            match: {
                airCode: airCode
            }   
        })
        .then(result => {
            const temp = result.filter(element => (element.idFlight!=null ))
            temp.map(element => {
                listUser.push(element.userInfo)
            })
        })    
    res.json({
        Quantity: listUser.length,
        List: listUser
    })
}

module.exports = {
    getListUserFlightInfo,
    setFlightInfo,
    getUserFlightInfo,
    sendMail,
    setStatusFlightAndMail,
    sendCodeAndMail,
    checkCode,
    renderListCustomer,
    checkPasswordToSetStatus
}