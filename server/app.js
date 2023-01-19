const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(bodyparser.json({ limit: '50mb' }))
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }))

const connectDB = require('./config/connect')
app.use("/users", require("./routes/users"))
app.use("/", require("./routes/login"))
app.use("/admins", require("./routes/admin"))

app.listen(4000, console.log('Server has started')) //then the server starts

const start = async () => {       //here we create an async server start function
    try {
        await connectDB(process.env.URL)  //The server will wait untill the api is connected to the mongodb url
    }
    catch (error) {
        console.log(error)
    }
}
start() 