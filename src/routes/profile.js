const express = require('express')
const Joi = require('joi')

const { jwtAuth } = require('../middlewares/auth')
const { encrypt, decrypt } = require('../library/encryption')

const User = require('../models/users.model')
const { Types } = require('mongoose')

const ProfileRoutes = express.Router()

ProfileRoutes.post('/api/profile/data', jwtAuth, async(req, res) => {
    try {
        req.body = decrypt(req)

        const schema = Joi.object({
            email: Joi.string().optional(),
            userId: Joi.string().optional()
        })

        const {error, value: body} = schema.validate(req.body)
        if(error) {
            throw new Error(error)
        }

        const conditions = {}
        if(body.userId) conditions._id = new Types.ObjectId(body.userId)
        else if (body.email) conditions.email = body.email
        else throw new Error('Email or userId is required')

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