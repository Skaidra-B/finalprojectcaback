const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forumSchema = new Schema({
    creatorId: {
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
    posts: [{
        username: {
            type: String
        },
        text: {
            type: String
        },
        time: {
            type: Number
        },
    }]

})

module.exports = mongoose.model('forumSchema', forumSchema)
