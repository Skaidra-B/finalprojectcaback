const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forumSchema = new Schema({
    creatorId: {
        type: String,
        required: true
    },
    creatorImg: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: false
    },
    posts: [{
        posterId: {
            type: String,
            required: true
        },
        posterImg: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        time: {
            type: Number,
            required: false
        },
    }]

})

module.exports = mongoose.model('forumSchema', forumSchema)
