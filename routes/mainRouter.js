const express = require('express')
const router = express.Router()
const {validateRegister, validatePhoto, validateProduct} = require("../middleware/validator")
const {register, login, addPhoto, create, getAll, getProduct, reserve, filter} = require("../controllers/mainController")

router.post("/register", validateRegister, register)
router.post("/login", login)

router.post("/addPhoto", validatePhoto, addPhoto)
router.post("/create", validateProduct, create)
router.get("/allProducts", getAll)
router.get("/product/:id", getProduct)
router.post("/filter", filter)




module.exports = router