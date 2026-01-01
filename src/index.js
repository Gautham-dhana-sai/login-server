const HealthCheckRoutes = require("./routes/health-check")
const loginRoutes = require("./routes/login")
const OtpRoutes = require("./routes/otp")
const passwordRoutes = require("./routes/password")
const SignupRoutes = require("./routes/signup")

const routes = [
    HealthCheckRoutes,
    SignupRoutes,
    OtpRoutes,
    passwordRoutes,
    loginRoutes
]

module.exports = routes