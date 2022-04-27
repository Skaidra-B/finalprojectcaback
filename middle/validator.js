const validator = require("email-validator")
const userSchema = require("../schemes/userSchema")

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
    validateLogin: (req, res, next) => {

    },
    validatePhoto: async (req, res, next) => {
        const {photoUrl} = req.body
        // console.log(req.body)
        if (photoUrl.length === 0) return res.send({success: false, error: "No photo url added"})
        if (!photoUrl.includes("http")) return res.send({success: false, error: "Wrong photo url added"})

        next()
    },
    validateProduct:  async (req, res, next) => {
        const {city, price, description} = req.body
        if (city.length === 0) return res.send({success: false, error: "No city added"})
        if (price === "0") return res.send({success: false, error: "No price added"})
        if (description.length === 0) return res.send({success: false, error: "No description added"})
        next()
    }

}