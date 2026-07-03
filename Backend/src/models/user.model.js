const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username already exist"],
        required:true
    },
    email: {
        type: String,
        unique: [true, "Email already exist, try to login"],
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel