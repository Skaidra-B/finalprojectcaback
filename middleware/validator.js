const validator = require("email-validator")
const userSchema = require("../models/userSchema")

module.exports = {

    registerValidator: async (req, res, next) => {
        const {username, email, passOne, passTwo} = req.body

        const findUsername = await userSchema.findOne({username})
        const findEmail = await userSchema.findOne({email})

        if (findEmail) return res.send({success: false, message: 'Email is already in use'})
        if (findUsername) return res.send({success: false, message: 'Username is already in use'})
        if (!validator.validate(email)) return res.send({success: false, error: "Wrong email"})
        if (passOne.length < 4 || passOne.length > 20) return res.send({success: false, error: "Bad password length"})
        if (passOne !== passTwo) return res.send({success: false, error: "Passwords do not match"})
        next()
    },
    loginValidator: async (req, res, next) => {
        const {email, password} = req.body

        if (!validator.validate(email)) return res.send({success: false, message: "Wrong email"})
        if (4 > password.length) return res.send({success: false, message: 'Password is too short'})
        if (password.length > 20) return res.send({success: false, message: 'Password is too long'})
        next()
    },
    forumUploadValidator: async (req, res, next) => {
        const {title} = req.body
        if (title.length === 0) return res.send({success: false, message: "Enter forum title"})

        next()
    },
    replyValidator: async (req, res, next) => {
        const {text} = req.body
        if (text.length === 0) return res.send({success: false, message: "Enter your reply"})
        next()
    }


}