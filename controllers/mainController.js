const bcrypt = require("bcrypt")
const userSchema = require("../models/userSchema")
const forumSchema = require("../models/forumSchema")


module.exports = {
    register: async (req, res) => {
        const {username, email, passOne} = req.body
        try {
            const hash = await bcrypt.hash(passOne, 10)
            const user = await new userSchema({
                username,
                email: email.toLowerCase(),
                password: hash,
                // notifications: []
            })
            await user.save()
            console.log(user.username, 'is registered')
            res.send({success: true, message: "Registration successful, you can login"})
        } catch (err) {
            console.log(err)
        }
    },
    stayLoggedIn: async (req, res) => {
        const {stayLoggedIn} = req.session
        const {email} = req.session
        try {
            if (stayLoggedIn) {
                const findUser = await userSchema.findOne({email})
                if (findUser) return res.send({success: true, user: findUser})
            }
            res.send({success: false})
        } catch (err) {
            console.log(err)
        }
    },
    login: async (req, res) => {
        const {email, password, stayLoggedIn} = req.body
        try {
            const findUser = await userSchema.findOne({email: email.toLowerCase()})
            if (findUser) {
                const compareResult = await bcrypt.compare(password, findUser.password)
                if (compareResult) {
                    req.session.email = email.toLowerCase()
                    req.session.username = findUser.username
                    req.session.stayLoggedIn = stayLoggedIn
                    const user = {
                        _id: findUser._id,
                        username: findUser.username,
                        email: findUser.email,
                        image: findUser.image,
                        forumsCreated: findUser.forumsCreated,
                        notifications: findUser.notifications
                    }
                    return res.send({success: true, user})
                }
                console.log(findUser.username, 'is logged in')
            }
            res.send({success: false, message: 'Wrong credentials'})
        } catch (err) {
            console.log(err)
        }
    },
    logout: async (req, res) => {
        try {
            req.session.email = null
            req.session.stayLoggedIn = null
            res.send({success: true})
        } catch (err) {
            console.log(err)
        }
    },
    addForum: async (req, res) => {
        const {title, ownerImg, ownerId} = req.body
        const {email, username} = req.session
        try {
            if (username) {
                const forum = new forumSchema({
                    creatorId: ownerId,
                    creatorImg: ownerImg,
                    username,
                    title,
                    time: Date.now(),
                    posts: []
                })
                await forum.save()

                const creator = await userSchema.findOneAndUpdate({_id: ownerId}, {$push: {forumsCreated: title}}, {new: true})
                return res.send({success: true})
            }
            res.send({success: false, message: "Not logged in"})
        } catch (err) {
            console.log(err)
        }
    },
    getAllForums: async (req, res) => {
        const allForums = await forumSchema.find()
        res.send({success: true, allForums})
    },
    getSingleForum: async (req, res) => {
        const {_id} = req.params
        try {
            const forum = await forumSchema.findOne({_id})
            return res.send({success: true, forum})

        } catch (err) {
            res.send({success: false, message: "Not logged in", err})
        }
    },
    reply: async (req, res) => {
        const {_id, posterId, username, text, posterImg} = req.body
        const {email} = req.session

        const user = await userSchema.findOne({_id: posterId})

        const newPost = {
            posterId,
            posterImg,
            username,
            text,
            time: Date.now()
        }
        const forumToFind = await forumSchema.findOne({_id})
        const thatUserId = forumToFind.creatorId
        const forumTitle = forumToFind.title

        const newNotification = {
            forumTitle,
            replierUsername: username,
            time: Date.now()
        }

        try {
            if (email) {
                const forum = await forumSchema.findOneAndUpdate({_id}, {$push: {posts: newPost}}, {new: true})
                const forumCreatorUpdate = await userSchema.findOneAndUpdate({_id: thatUserId}, {$push: {notifications: newNotification}}, {new: true})
                res.send({success: true, message: "Reply added"})
            }
        } catch (err) {
            res.send({success: false, message: "Not logged in", err})
        }
    },
    getUploadedForums: async (req, res) => {
        const {userId} = req.params
        try {
            const uploadedForums = await forumSchema.find({creatorId: userId})
            return res.send({success: true, uploadedForums})
        } catch (err) {
            res.send({success: false, message: err})
        }
    },
    getPosts: async (req, res) => {
        const {userId} = req.params
        try {
            const uploadedPosts = await forumSchema.find({"posts.posterId": userId})
            console.log(uploadedPosts)
            return res.send({success: true, uploadedPosts})
        } catch (err) {
            res.send({success: false, message: err})
        }
    },
    changePicture: async (req, res) => {
        const {userId, picture} = req.body
        const {email} = req.session
        console.log(req.body)

        try {
            if (email) {
                const updated = await userSchema.findOneAndUpdate({_id: userId}, {$set: {image: picture}}, {new: true})
                return res.send({success: true, updated})
            }
        } catch (err) {
            res.send({success: false, message: "Not logged in", err})
        }
    },
    deleteNotification: async (req, res) => {
        const {notId} = req.params
        console.log(req.params)
        const {email} = req.session
        try {
            const deleted = await userSchema.findOneAndUpdate({"notifications._id": notId}, {$pull: {notifications: {_id: notId}}}, {new: true})
            return res.send({success: true, deleted})
        } catch (err) {
            res.send({success: false})
        }
    }
}
