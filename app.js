const express = require('express')
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const router = require("./routes/mainRouter")
const session = require("express-session")
require("dotenv").config()

app.listen(4000)
app.use(express.json())


mongoose.connect(process.env.mongo_key).then(() => {
    console.log('connection ok')
}).catch(e => {
    console.log(e)
    console.log("connection failed")
})
app.use(session({
    secret: (process.env.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.use(cors({credentials: true, origin: true}))

app.use("/", router)
