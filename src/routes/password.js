const express = require("express");
const Joi = require("joi");

const User = require("../models/users");

const { encrypt, decrypt } = require("../library/encryption");

const passwordRoutes = express.Router()

passwordRoutes.post("/change/password", async (req, res) => {
    req.body = decrypt(req);
    const Schema = Joi.object({
        project: Joi.string().optional().allow(null),
        mail_id: Joi.string().required(),
        password: Joi.string().required(),
    });
    try {
        const project_cond = body.project || null
        const { error, value: body } = Schema.validate(req.body);
        if (error) {
            console.log(error);
            const response = error.details[0];
            return res.json(encrypt(response));
        }
        await User.updateOne(
            { project: project_cond, mail_id: body.mail_id },
            { $set: { password: body.password } }
        );
        const response = {
            success: true,
            error: false,
            message: "Password reset successful.",
        };
        console.log(response);
        return res.json(encrypt(response));
    } catch (error) {
        console.log(error);
    }
});

module.exports = passwordRoutes