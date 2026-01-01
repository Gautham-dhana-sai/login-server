const nodemailer = require("nodemailer");
require("dotenv").config()

const sendMails = (mailData) => {
    let sender = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        // port: 587,
        // secure: false,
        service: "gmail",
        auth: {
            user: process.env.SENDER_MAIL,
            pass: process.env.SENDER_PASSWORD,
        },
    });

    let receiver = {
        from: process.env.SENDER_MAIL,
        to: mailData.receiver,
        subject: mailData.subject,
        text: mailData.content,
    };

    sender.sendMail(receiver, (error, resp) => {
        if (error) {
            return console.log(error);
        }
        console.log("email sent", resp);
    });
};

module.exports = { sendMails };
