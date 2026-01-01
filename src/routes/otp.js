const express = require("express");
const Joi = require("joi");

const User = require("../models/users.model");
const Otp = require("../models/otps.model");

const { generateOtp } = require("../library/otp");
const { sendMails } = require("../library/mail");
const { encrypt, decrypt } = require("../library/encryption");

const OtpRoutes = express.Router()

OtpRoutes.post("/resend/otp", async (req, res) => {
    req.body = decrypt(req);
    const Schema = Joi.object({
        project: Joi.string().optional().allow(null),
        mail_id: Joi.string().required(),
    });
    try {
        const { error, value: body } = Schema.validate(req.body);
        const project_cond = body.project || null
        if (error) {
            console.log(error);
            const response = error.details[0];
            return res.json(encrypt(response));
        }

        const user = await User.findOne({
            project: project_cond,
            mail_id: body.mail_id,
        });
        if (!user) {
            const response = {
                success: true,
                error: false,
                message: "User doesn't exists.",
                otp: false,
            };
            return res.json(encrypt(response));
        }

        const otp = generateOtp();
        const newOtp = {
            project: project_cond,
            mail_id: body.mail_id,
            otp,
            expiry: new Date(moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss")),
            status: 1
        };
        await Otp.deleteMany({ project: project_cond, mail_id: body.mail_id });
        const mailData = {
            receiver: body.mail_id,
            subject: "Sign up Verification",
            content: otp + " is your OTP for verification.",
        };
        await sendMails(mailData);
        await Otp.create(newOtp);
        const response = {
            success: true,
            error: false,
            message: "new OTP sent.",
            otp: true,
        };
        return res.json(encrypt(response));
    } catch (error) {
        console.log(error);
    }
});

module.exports = OtpRoutes