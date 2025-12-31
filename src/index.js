const loginRoutes = require("./routes/login")
const OtpRoutes = require("./routes/otp")
const passwordRoutes = require("./routes/password")
const SignupRoutes = require("./routes/signup")

const routes = [
    SignupRoutes,
    OtpRoutes,
    passwordRoutes,
    loginRoutes
]

module.exports = routes