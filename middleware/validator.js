const validator = require("email-validator")
const userSchema = require("../models/userSchema")

module.exports = {

    validateRegister: async (req, res, next) => {
        const {email, passOne, passTwo} = req.body
        if (!validator.validate(email)) return res.send({success: false, error: "Wrong email"})
        const user = await userSchema.findOne({email})
        if (user) res.send({success: false, error: "Email is already in use"})
        if (passOne.length < 4 || passOne.length > 20) return res.send({success: false, error: "bad password length"})
        if (passOne !== passTwo) return res.send({success: false, error: "passwords do not match"})

        next()
    },



}