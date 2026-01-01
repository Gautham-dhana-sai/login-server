const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const OtpSchema = new Schema({
    project: { type: String, nullable: true },
    email: { type: String },
    otp: { type: String },
    expiry: { type: Date, index: { expires: '5m' }, default: Date.now() },
    status: { type: Number },
    created_at: { type: Date },
    updated_at: { type: Date },
}, { timestamps: true });

const Otp = mongoose.model("otp", OtpSchema);
Otp.createCollection();

module.exports = Otp;
