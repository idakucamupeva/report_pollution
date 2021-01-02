var nodemailer = require('nodemailer');

function sendMail() {
    var exec = require('child_process').exec, child;

    child = exec('/home/boris/main.py zagadjenje pancevo',
                 (error, email, stderr) => {
                    console.log(email)

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'cvitak.boris@gmail.com',
                            pass: 'password'
                        }
                    });
                    
                    const mailOptions = {
                        from: 'cvitak.boris@gmail.com',
                        to: email,
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!'
                    };
                    
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
            });
}

module.exports = sendMail;
