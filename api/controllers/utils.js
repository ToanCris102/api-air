const nodemailer = require('nodemailer')

const sendMail = async (mail) => {
    //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
    var transporter =  nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'galaktik0208@gmail.com', //Tài khoản gmail vừa tạo
            pass: 'tTOAN0375155102' //Mật khẩu tài khoản gmail vừa tạo
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    var content = '';
    content += `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
                <span style="color: black">Đây là mail test</span>
            </div>
        </div>
    `;
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'NQH-Test nodemailer',
        to: mail,
        subject: 'Test Nodemailer',
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

}

module.exports = {
    sendMail
}