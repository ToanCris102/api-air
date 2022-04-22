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
    try {
        const infoFlight = await UserFlightInfo
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
                if(result != null)
                    res
                        .status(200)
                        .json({
                            success: true,
                            result: result
                        })
            })
        //console.log(!infoFlight)
        if(!infoFlight)
            return res
                    .status(401)
                    .json({
                        success: false,
                        message: "Can't find anything"
                    })
        
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }    
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
    console.log({purchaser, users, airCode})
    try {
        const tickets = []
        const listId = []
        for (let i in users){
            await UserFlightInfo        
                .find({ })
                .populate({
                    path: 'idFlight',
                    match: {
                        airCode: airCode
                    },
                    populate: {
                        path: 'departure destination',
                        select: 'name -_id'
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
        // console.log(tickets)
        // console.log(listId)
        // console.log(tickets[0].purchaser.userName.suffix + " "+ tickets[0].purchaser.userName.lastName)
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
        const day = new Date()
        const title = 'Ticket infomation at ' + day

        // const content = `
        //     <div style="padding: 5px; background-color: #003375">
        //         <div style="padding: 10px; background-color: white;">
        //             <h3 style="color: #0085ff">Xin Chào ${tickets[0].purchaser.userName.suffix} ${tickets[0].purchaser.userName.lastName} thông tin về số vé của bạn</h3>
        //             <p style="color: black">Mã vé: ${listId}</p>
        //         </div>
        //     </div>
        // `;
        console.log(tickets.length)
        let idStringCard = ''
        for(let i = 0; i < tickets.length; i++){
            idStringCard += `${tickets[i].userInfo.userName.suffix} ${tickets[i].userInfo.userName.lastName}: <span style="font-size: 25px; font-weight: 500;">${listId[i]}</span> <br></br>`
            //console.log(`${tickets[i].userInfo.userName.suffix} ${tickets[i].userInfo.userName.lastName}: <span style="font-size: 25px; font-weight: 500;">/${listId[i]}/</span> <br></br>`)
        }
        
        const trader = tickets[0].trader == false ? 'Business' : 'Economy'
        //console.log(trader)
        //console.log(tickets[0].idFlight.departureTime.toTimeString())
        const content = `
        <div class="mail" style="font-size: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div class="header" style="height: 150px; display: flex; justify-content: center; align-items: center;">
                <div style="text-align: center;">
                    <p style="font-weight: 500; font-size: 25px;">Hi ${tickets[0].purchaser.userName.suffix} ${tickets[0].purchaser.userName.lastName},</p>
                    <p>Thank you for using DaTo Airways</p>
                </div>
            </div>
            <div class="content" style="color : white;">
                <div class="yourtrip" style="height: 325px; background-color: #0C172E; border : 2px solid green; text-align: center; padding: 50px 0">
                    <p style="font-size: 35px; font-weight: 500;">Your trip</p>
                    <div style="height: 20px;"></div>
                    <div class="left" style="display: inline-block; width: 25%; height: 100%; text-align: center; padding: 25px;">
                        <div>
                            <table style="text-align: left; height: 150px; width: 100%;">
                                <tr>
                                    <td>From:</td>
                                    <td style="font-size: 25px; font-weight: 500; color: #e8a207">${tickets[0].idFlight.departure.name}</td>
                                </tr>
                                <tr>
                                    <td>Depart date:</td>
                                    <td style="font-size: 25px; font-weight: 500; color: #e8a207">${tickets[0].idFlight.departureTime.toDateString()}<td>
                                </tr>
                                <tr>
                                    <td>Duration:</td>
                                    <td style="font-size: 25px; font-weight: 500; color: #e8a207">${tickets[0].idFlight.timeTemp.hour} hours ${tickets[0].idFlight.timeTemp.minute} minutes<td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="right" style="display: inline-block; width: 25%; height: 100%; text-align: center; padding: 25px;">
                        <table style="text-align: left; height: 150px; width: 100%;">
                            <tr>
                                <td>To:</td>
                                <td style="font-size: 25px; font-weight: 500; color: #e8a207">${tickets[0].idFlight.destination.name}</td>
                            </tr>
                            <tr>
                                <td>Depart time:</td>
                                <td style="font-size: 25px; font-weight: 500; color: #e8a207">${tickets[0].idFlight.departureTime.toTimeString()}<td>
                            </tr>
                            <tr>
                                <td>Class:</td>
                                <td style="font-size: 25px; font-weight: 500; color: #e8a207">${trader}<td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="ticket" style="padding-top: 50px; text-align: center; color: #0C172E;">
                    <p style="font-size: 35px; font-weight: 500;">Ticket No</p>
                    <div style="width: 30%; margin: auto; margin-top: 50px; text-align: left; line-height: 35px;">
                        ${idStringCard}
                    </div><br>
                    <p> <b>Notice: </b> For ticket details and ticket printing, please visit the website <span style="font-weight: 500">DaTo Airways</span></p>
                </div>
            </div>
            <div class="footer" style="margin-top: 50px;">
                <div style="margin: auto; width: 50%; text-align: center;">
                    <hr><br>
                    <p>Best regards,</p>
                    <p>Contact with us if you have any problem</p>
                    <p style="font-size: 25px; font-weight: 500;">DaTo Airways</p>
                    <span style="margin-right: 20px;">Hotline: 19008888</span>|<span style="margin-left: 20px;">Email: datoairways@gmail.com</span>
                </div>
            </div>
        </div>
    `
    //console.log(content)
        const mail =  tickets[0].purchaser.userEmail//'crisriorock0@gmail.com'
        await Utils.sendMail(mail, content, title)    
        res.json({
            success: true,
            message: "Send mail after ...",
        })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: error
            })
    }
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
    const reason = req.body.reason
    await Flight.findOneAndUpdate(
        {airCode: airCode},
        {status: false},
        {new: true}
    ).then( result => {
        //console.log(result)
        const idFlight = result._id
        // console.log(idFlight)
        UserFlightInfo
            .find({idFlight: idFlight})
            .populate({
                path: 'idFlight purchaser'
            })
            .then(result => {           
                result.map(async user => {
                    console.log(user.purchaser.userEmail)
                    const content = `Chuyến bay số hiệu ${airCode} mã vé ${user._id} của bạn đã bị hủy vì lý do: ${reason} <br>Thông tin chi tiết xin liên hệ 0123456789`
                    const dayCur = new Date()
                    const title = 'Thông báo hủy chuyến bay ' + dayCur.toDateString() 
                    await Utils.sendMail(user.purchaser.userEmail, content, title)
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
    const listTemp = []
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
                if(!listTemp.includes(element.userInfo.identificationCard)){
                    listTemp.push(element.userInfo.identificationCard)
                    listUser.push(element.userInfo)
                }
                
                
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