const express = require('express')
const router = express.Router()
const {validateRegister, validatePhoto, validateProduct} = require("../middle/validator")
const {register, login, addPhoto, create, getAll, getProduct, reserve, filter, getEvent, stayLogged} = require("../controllers/mainController")

router.post("/register", validateRegister, register)
router.post("/login", login)
router.get("/staysLogged/:isLogged/:email", stayLogged)
router.post("/addPhoto", validatePhoto, addPhoto)
router.post("/create", validateProduct, create)
router.get("/allProducts", getAll)
router.get("/product/:id", getProduct)
router.post("/filter", filter)
// calendar
router.post("/makeReservation", reserve)
router.get("/getDates", getEvent)

module.exports = router