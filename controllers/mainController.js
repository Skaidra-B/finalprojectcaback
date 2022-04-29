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
                notifications: []
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
        // const {email} = req.session
        const {_id} = req.params
        try {
            const forum = await forumSchema.findOne({_id})
            return res.send({success: true, forum})

        } catch (err) {
            res.send({success: false, message: "Not logged in", err})
        }
        // try {
        //     if (email) {
        //         const forum = await forumSchema.findOne({_id})
        //         return res.send({success: true, forum})
        //     }
        //     res.send({success: false, message: "Not logged in"})
        // } catch (err) {
        //     console.log(err)
        // }
    },
    reply: async (req, res) => {
        const {_id, posterId, username, text, posterImg} = req.body
        const {email} = req.session

        const user = await userSchema.findOne({_id: posterId})
        // console.log(user.username)

        const newPost = {
            posterId,
            posterImg,
            username,
            text,
            time: Date.now()
        }

        try {
            if (email) {
                const forum = await forumSchema.findOneAndUpdate({_id}, {$push: {posts: newPost}}, {new: true})
                res.send({success: true, message: "Reply added"})
            }
        } catch (err) {
            res.send({success: false, message: "Not logged in", err})
        }
    },
    getUploadedForums:  async (req, res) => {
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
        // console.log(req.params)
        try {
            const uploadedPosts = await forumSchema.find({"posts.posterId" : userId})
            // const uploadedPosts = await forumSchema.find({posts: {$elemMatch: {posterId : userId}}})
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
                // const refreshUsers = await userSchema.find()
                // const refreshForums = await forumSchema.find()
                return res.send({success: true, updated})
            }
        } catch (err) {
            res.send({success: false, message: "Not logged in", err})
        }
    }


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

}
