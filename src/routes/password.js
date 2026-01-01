const express = require("express");
const Joi = require("joi");

const User = require("../models/users.model");

const { encrypt, decrypt } = require("../library/encryption");

const passwordRoutes = express.Router()

passwordRoutes.post("/change/password", async (req, res) => {
    req.body = decrypt(req);
    const Schema = Joi.object({
        project: Joi.string().optional().allow(null),
        email: Joi.string().required(),
        password: Joi.string().required(),
    });
    try {
        const { error, value: body } = Schema.validate(req.body);
        if (error) {
            console.log(error);
            const response = error.details[0];
            return res.json(encrypt(response));
        }
        const project_cond = body.project || null
        body.email = body.email.toLowerCase()

        await User.updateOne(
            { project: project_cond, email: body.email },
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