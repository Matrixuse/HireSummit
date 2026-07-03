const mongoose = require('mongoose')

const blacklistToken = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is blacklist if user logout"]
    }
},{
    timestamps: true
})

const blacklistModel = mongoose.model("blacklistTokens", blacklistToken)

module.exports = blacklistModel
