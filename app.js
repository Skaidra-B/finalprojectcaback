const express = require('express')
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const router = require("./routes/mainRouter")
const session = require("express-session")
require("dotenv").config()


// const forumSchema = require("./models/forumSchema")
// const { Server } = require("socket.io")
// const http = require("http");
// const server = http.createServer(app)



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


// SOCKET
// const io = new Server(server, {
//     cors: {
//         origin: origin,
//         methods: ["GET", "POST"],
//     }
// });

// io.on("connection", (socket) => {
//     console.log("connected",socket.id)
//
//     socket.on("join_auction", (data) => {
//         socket.join(data)
//         console.log(`User with ID: ${socket.id} joined room: ${data}`)
//     })
//     socket.on("new_post", async(data) => {
//         setTimeout(async () => {
//             const productUpdated = await forumSchema.find({_id: data.productId})
//             socket.to(data.productId).emit("update_product", productUpdated)
//             console.log(productUpdated)
//         }, 1000)
//
//     })
//
//     socket.on("disconnect", () => {
//         console.log("user disconnected", socket.id)
//     })
// })
