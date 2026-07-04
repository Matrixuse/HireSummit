const jwt = require('jsonwebtoken')
const blacklistModel = require('../models/blacklist.model')

async function authUser( req, res, next) {
    let token = req.cookies && req.cookies.token;
    let tokenSource = 'none'

    if (token) tokenSource = 'cookie'

    if (!token && req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1]
        tokenSource = 'authorization_header'
    }

    if(!token) {
        console.debug('[authUser] no token provided (cookie or Authorization header)')
        return res.status(401).json({
            message: "Unauthorized",
            reason: 'no_token'
        })
    }

    // log minimal token info for dev debugging (first 8 chars only)
    console.debug('[authUser] token source:', tokenSource, 'token_preview:', token && token.slice(0, 8))

    const isTokenBlacklisted = await blacklistModel.findOne({ token })

    if(isTokenBlacklisted) {
        console.debug('[authUser] token is blacklisted')
        return res.status(401).json({
            message: "Token is blacklisted",
            reason: 'blacklisted'
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        return next()

    }catch(err) {
        console.error('[authUser] token verify error:', err && err.message)
        return res.status(401).json({
            message: "Invalid Token",
            reason: err && err.message
        })
    }
}

module.exports = { authUser }