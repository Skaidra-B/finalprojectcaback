const express = require('express')
const router = express.Router()
const {
    registerValidator,
    loginValidator,
    forumUploadValidator,
    replyValidator,
    userLoggedInValidator,
    checkUserInfo,
    pictureValidator
} = require("../middleware/validator")
const {
    register,
    stayLoggedIn,
    login,
    logout,
    addForum,
    getAllForums,
    getSingleForum,
    reply,
    getUploadedForums,
    getPosts,
    changePicture,

} = require("../controllers/mainController")

// USER
router.post("/register", registerValidator, register)
router.post("/login", loginValidator, login)
router.get('/stayLoggedIn', stayLoggedIn)
router.get('/logout', logout)
router.get('/get-uploaded-forums/:userId', userLoggedInValidator, getUploadedForums)
router.get('/get-posts/:userId', checkUserInfo, getPosts)
router.post("/change-picture", pictureValidator, changePicture)

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