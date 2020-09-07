const User = require("../models/user");

exports.getUserByUsername = (req, res, next, id) => {
    User.findOne({username: id})
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "Looks like user is not available!"
                })
            }
            req.user = user
            next()
        })
}

// Getting a Single User
exports.getSingleUser = (req, res) => {
    req.user.salt = undefined
    req.user._email = undefined
    req.user.encry_password = undefined
    req.user.createdAt = undefined
    req.user.updatedAt = undefined
    req.user.comments = undefined
    req.user.followers = undefined
    req.user.following = undefined

    res.json(req.user)
}
// Get user followers
exports.getUserFollowers = (req,res) => {
    User.findById(req.user._id)
        .populate("followers", "_id username name userImageUrl")
        .exec((err,user)=> {
            if(err){
                return res.status(400).json({
                    error: "No followers found!"
                })
            }
            if(user.followers.length === 0){
                return res.status(400).json({
                    error: "User doesn't have any follower!"
                })
            }
            res.json(user.followers)
        })
}
// Get user following
exports.getUserFollowing = (req,res) => {
    User.findById(req.user._id)
        .populate("following", "_id username name userImageUrl")
        .exec((err,user)=> {
            if(err){
                return res.status(400).json({
                    error: "No followers found!"
                })
            }
            if(user.followers.length === 0){
                return res.status(400).json({
                    error: "User doesn't have any follower!"
                })
            }
            res.json(user.following)
        })
}

// Getting all the users!
exports.getAllUsers = (req, res) => {
    User.find()
        .limit(8)
        .select("-role -products -hunts -followers -following -comments -_email -salt -encry_password -createdAt -updatedAt")
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    error: "Looks like the Database is empty!"
                })
            }
            return res.json(users)
        })
}