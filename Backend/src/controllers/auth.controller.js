const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ConnectionStates } = require('mongoose')
const blacklistModel = require('../models/blacklist.model')

/**
 * 
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

async function registerUser(req, res) {
    const { username, email, password } = req.body

    if(!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide the credentials"
        })
    }

    const userAlreadyExist = await userModel.findOne({ 
        $or: [{ email }, { username }]
    })

    if(userAlreadyExist) {
        return res.status(400).json({
            message: "User already exist"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username},
        process.env.JWT_SECRET,
    )

    res.cookie("token", token, {
       httpOnly: true,
       sameSite: "lax",
       secure: false,
       path: '/'
    });

    res.status(201).json({
        message: "User register successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * 
 * @route POST /api/auth/login
 * @desc Login an existing user
 * @access Public
 */

async function loginUser(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if(!user) {
        return res.status(400).json({
            message: "Invalid User"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid User"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username},
        process.env.JWT_SECRET,
    )

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: '/'
    });

    res.status(201).json({
        message: "User login successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
    * @route POST /api/auth/logout
    * @desc Logout an existing user
    * @access Private
 */

async function logoutUser(req, res) {
    const token = req.cookies.token

    if(token) {
        await blacklistModel.create({token})
    }

    res.clearCookie('token')

    res.status(200).json ({
        message: "User logout successfully"
    })
}

/**
 * 
 * @route GET /api/auth/getMe
 * @desc Get the current logged-in user
 * @access Private
 */

async function getMe(req, res) {
    const user = await userModel.findById(req.user.id)

    if(!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.status(200).json({
        message: "User found",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = { registerUser, loginUser, logoutUser, getMe }