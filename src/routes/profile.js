const express = require('express')
const Joi = require('joi')

const { jwtAuth } = require('../library/auth')
const { encrypt, decrypt } = require('../library/encryption')

const User = require('../models/users.model')

const ProfileRoutes = express.Router()

ProfileRoutes.post('/api/profile/data', jwtAuth, async(req, res) => {
    try {
        req.body = decrypt(req)

        const schema = Joi.object({
            email: Joi.string().required(),
            userId: Joi.string().length(10).optional()
        })

        const {error, value: body} = schema.validate(req.body)
        if(error) {
            throw new Error(error)
        }

        const conditions = {email: body.email}
        if(body.userId) conditions.userId = body.userId

        const userData = await User.findOne(conditions)
        const response = {
            success: true,
            data: userData,
            message: 'Data fetched successfully'
        }
        return res.status(200).json(encrypt(response))
    } catch(error) {
        console.log(error, 'Error at fetching profile data')
        return res.status(200).json(encrypt({success: false, message: error.message}))
    }
})

module.exports = ProfileRoutes