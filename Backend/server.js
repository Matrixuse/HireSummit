const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const app = require('./src/app')
const connectDB = require('./db/db')
const { validateGroqApiKey } = require('./src/services/aiservice')

connectDB()
validateGroqApiKey()

app.listen(3000, () => {
    console.log("Server is listening on port no 3000")
})