const express = require("express")

const HealthCheckRoutes = express.Router()

HealthCheckRoutes.get('/', async (req, res) => {
    try {
        return res.status(200).json({status: 'Server is active'}).end()
    } catch (error) {
        console.log(error, 'Error at Health Check')
    }
})

module.exports = HealthCheckRoutes