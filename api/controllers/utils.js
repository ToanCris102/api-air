const nodemailer = require('nodemailer')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const UserAccount = require('../models/UserAccount')
const sendMail = async (mail, content) => {
    //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
    var transporter =  nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'datoairways@gmail.com', //Tài khoản gmail vừa tạo
            pass: 'dato8888@' //Mật khẩu tài khoản gmail vừa tạo
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
   
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'NQH-Test nodemailer',
        to: mail,
        subject: 'Ticket infomation',
        text: 'Your text is here',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
        html: content //Nội dung html mình đã tạo trên kia :))
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err)
            req.flash('mess', 'Lỗi gửi mail: '+err)//Gửi thông báo đến người dùng
            res.redirect('/')
        } else {
            console.log('Message sent: ' +  info.response)
            req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn') //Gửi thông báo đến người dùng
            res.redirect('/')
        }
    })    
    return mainOptions
}

const createCodeNumber = async (mail) => {
    const code = Math.floor(Math.random() * 800000 + 100000).toString()
    const content = code
    await sendMail(mail, content)
    return await argon2.hash(code) 
}

const checkCodeNumber = async (code, encode) => {
    return await argon2.verify(encode, code)
}

const checkPasswordWithTokenPassword = async (password, token) => {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const userId = decoded.userId
    const user = await UserAccount.findById({_id: userId})
    return await argon2.verify(user.userPassword, password)
}

module.exports = {
    sendMail,
    createCodeNumber,
    checkCodeNumber,
    checkPasswordWithTokenPassword
}