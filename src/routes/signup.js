const express = require("express");
const Joi = require("joi");
const moment = require("moment");

const User = require("../models/users");
const Otp = require("../models/otps");

const { generateOtp } = require('../library/otp')
const { sendMails } = require("../library/mail");
const { encrypt } = require("../library/encryption");

const SignupRoutes = express.Router();

SignupRoutes.post("/signup/user", async (req, res) => {
    req.body = decrypt(req)
    const Schema = Joi.object({
        project: Joi.string().optional().allow(null),
        username: Joi.string().optional().allow(null, ""),
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    try {
        const project_cond = body.project || null
        const { error, value: body } = Schema.validate(req.body);
        if (error) {
            console.log(error);
        }

        const user = await User.findOne({ project: project_cond, email: body.email });
        if (user && user.status === 0)
            return res.status(200).json(encrypt({ success: true, error: false, verified: false, message: "User not verified!" }));
        else if (user)
            return res.status(200).json(encrypt({ success: true, error: false, verified: true, message: "User already exists!" }));

        const user_body = {
            project: body.project,
            email: body.email,
            password: body.password,
            username: body.username,
            status: 0,
        }

        const otp = generateOtp();
        const otp_body = {
            email: body.email,
            otp,
            expiry: moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss"),
            status: 1
        }

        const mailData = {
            receiver: body.email,
            subject: "Sign up Verification",
            content: otp + " is your Otp.",
        };

        await sendMails(mailData);
        await User.create(user_body)
        await Otp.create(otp_body)
        return res.status(200).json(encrypt({ response: "OTP sent.", verified: false, success: true, error: false }));
    } catch (error) {
        console.log(error);
    }
});

SignupRoutes.post("/signup/verify/otp", async (req, res) => {
    req.body = decrypt(req)
    const Schema = Joi.object({
        project: Joi.string().optional().allow(null),
        email: Joi.string().required(),
        otp: Joi.string().required(),
    });
    try {
        const project_cond = body.project || null
        const { error, value: body } = Schema.validate(req.body);
        if (error) {
            console.log(error);
        }
        const user = await User.findOne({ project: project_cond, email: body.email })
        if (!user)
            return res.status(200).json(encrypt({ success: true, error: false, verified: false, message: "No user exists" }));
        else if (user.status === 1)
            return res.status(200).json(encrypt({ success: true, error: false, verified: false, message: "User already verified" }));

        const userOtp = await Otp.findOne({ project: project_cond, email: body.email, status: 1 });
        if (!userOtp)
            return res.status(200).json(encrypt({ success: true, error: false, verified: false, message: "OTP expired, please try again." }));

        if (userOtp.otp != body.otp)
            return res.status(200).json(encrypt({ success: true, error: false, verified: false, message: "Wrong Otp." }));
        else if (userOtp.otp === body.otp && userOtp.expiry < moment().format("YYYY-MM-DD HH:mm:ss"))
            return res.status(200).json(encrypt({ success: true, error: false, verified: false, message: "Otp expired." }));
        else {
            await User.updateOne({ project: project_cond, email: body.email }, { $set: { status: 1 } });
            await Otp.updateOne(
                {
                    email: body.email,
                    status: 1
                },
                { $set: { status: 2 } }
            );
            const mailData = {
                receiver: body.email,
                subject: "Account Verified",
                content: "Your account is verified successfully.",
            };
            await sendMails(mailData);
            return res.status(200).json(encrypt({ success: true, error: false, verified: true, message: "Verified." }));
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = SignupRoutes