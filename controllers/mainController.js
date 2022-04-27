const bcrypt = require("bcrypt")
const userSchema = require("../models/userSchema")


module.exports = {
    register: async (req, res) => {
        const {email, password} = req.body
        try {
            const hash = await bcrypt.hash(password, 10)
            const user = await new userSchema({
                email: email.toLowerCase(),
                password: hash,
                notifications: []
            })
            await user.save()
            console.log('useris', user.username, 'uzregistruotas')
            res.send({success: true, message: "Užsiregistravote sėkmingai, galite prisijungti"})
        } catch (err) {
            console.log(err)
        }
    },
    // register: async (req, res) => {
    //     const {email, passOne: password, isAdmin} = req.body
    //     const hash = await bcrypt.hash(password, 10)
    //     const user = new userSchema()
    //     user.email = email
    //     user.password = hash
    //     user.admin = isAdmin
    //
    //     const userExists = await userSchema.findOne({email})
    //     if (!userExists) {
    //         await user.save()
    //         res.send({success: true})
    //     }
    // },
    login: async (req, res) => {
        const {email, password, stayLogged} = req.body
        const myUser = await userSchema.findOne({email})
        const compareResult = await bcrypt.compare(password, myUser.password)
        if (compareResult) {
            req.session.stayLogged = stayLogged

            return res.send({success: true, user: {email, stayLogged}})
        }
        res.send({success: false, message: "bad credentials"})
    },
    stayLogged: async (req, res) => {
        const {isLogged, email} = req.params
        console.log(isLogged)
        const myUser = await userSchema.findOne({email})
        if (isLogged) {
            res.send({success: true, user: myUser})
        } else {
            res.send({success: false})
        }
    },
    addPhoto: async (req, res) => {
        const {photoUrl} = req.body

        const apartment = new apartmentSchema()
        apartment.photo = photoUrl
        apartment.city = "any"
        apartment.price = "any"
        apartment.description = "any"
        apartment.start = []
        apartment.end = []
        await apartment.save()

        res.send({success: true, id: apartment._id})
    },
    create: async (req, res) => {
        const {city, price, description, apartmentId} = req.body
        // const foundApartment = await apartmentSchema.findOne({_id: apartmentId})
        // console.log(foundApartment)
        const updateObject = {$set: {city, price, description}}

        const updated = await apartmentSchema.findOneAndUpdate(
            {_id: apartmentId},
            updateObject,
            {new: true}
        )
        res.send({success: true, apartment: updated})
    },
    getAll: async (req, res) => {
        const products = await apartmentSchema.find()
        res.send({success: true, products})
    },
    getProduct: async (req, res) => {
        const {id} = req.params
        const apartment = await apartmentSchema.findOne({_id: id})
        res.send({success: true, apartment})
    },
    ///// calendar
    reserve: async (req, res) => {
        const {event} = req.body
        console.log(req.body)

        // const {startDate, endDate, apartmentId} = req.body
        // console.log(req.body)

        // const updateApartment = {$push: {start: startDate, end: endDate}}
        // const updated = await apartmentSchema.findOneAndUpdate(
        //     {_id: apartmentId},
        //     updateApartment,
        //     {new: true}
        // )
        // res.send({success: true, apartment: updated})

    },
    ////
    // getEvent: async (req, res) => {
    //     const events = await apartmentSchema.find({
    //         start: {$gte: moment(req.query.start).toDate()},
    //         end: {$lte: moment(req.query.end).toDate()}
    //     })
    //     res.send(events)
    // },
    filter: async (req, res) => {
        const {city, price, availability} = req.body
        // console.log(req.body)
        // res.send({success: true})
        const products = await apartmentSchema.find({
            $or: [
                {city}, {price: {$gte: price[0], $lte: price[1]}}
            ]
        })
        // console.log(products)
        res.send({success: true, products})
    }

}
