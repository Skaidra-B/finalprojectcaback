const express = require('express')
const router = express.Router()
const {registerValidator, loginValidator, forumUploadValidator, replyValidator} = require("../middleware/validator")
const {register, stayLoggedIn, login, logout, addForum, getAllForums, getSingleForum, reply} = require("../controllers/mainController")

// USER
router.post("/register", registerValidator, register)
router.post("/login", loginValidator, login)
router.get('/stayLoggedIn', stayLoggedIn)
router.get('/logout', logout)

// FORUM
router.post("/upload", forumUploadValidator, addForum)
router.get('/get-all-forums', getAllForums)
router.get('/get-single-forum/:_id', getSingleForum)
router.post("/reply-to-forum", replyValidator, reply)



// router.post("/addPhoto", validatePhoto, addPhoto)
// router.post("/create", validateProduct, create)
// router.get("/allProducts", getAll)
// router.get("/product/:id", getProduct)
// router.post("/filter", filter)




module.exports = router