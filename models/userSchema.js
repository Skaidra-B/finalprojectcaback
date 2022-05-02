const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
    },
    forumsCreated: {
        type: Array,
        require: true
    },
    notifications: [{
        forumTitle: {
            type: String,
            required: true
        },
        replierUsername: {
            type: String,
            required: true
        },
        time: {
            type: Number,
            required: false
        }
    }]
})

module.exports = mongoose.model('userSchema', userSchema)