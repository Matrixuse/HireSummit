const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.options(/.*/, cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const router = require('./routes/auth.routes') 
const interviewRouter = require('./routes/interview.routes')

app.use('/api/auth', router)
app.use('/api/interview', interviewRouter)

module.exports = app