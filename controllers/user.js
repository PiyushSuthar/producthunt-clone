const User = require("../models/user");

// Params
exports.getUserByUsername = (req, res, next, id) => {
    User.findOne({ username: id })
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

// Utility Function
function parseUser(user) {
    user.salt = undefined
    user._email = undefined
    user.encry_password = undefined
    user.createdAt = undefined
    user.updatedAt = undefined
    user.comments = undefined
    user.followers = undefined
    user.following = undefined
    return user
}

// Getting a Single User
exports.getSingleUser = (req, res) => {
    const parsedUser = parseUser(req.user)
    res.json(parsedUser)
}
// Get user followers
exports.getUserFollowers = (req, res) => {
    User.findById(req.user._id)
        .populate("followers", "_id username name userImageUrl")
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "No followers found!"
                })
            }
            if (user.followers.length === 0) {
                return res.status(400).json({
                    error: "User doesn't have any follower!"
                })
            }
            res.json({
                count: user.followersCount,
                followers: user.followers
            })
        })
}
// Get user following
exports.getUserFollowing = (req, res) => {
    User.findById(req.user._id)
        .populate("following", "_id username name userImageUrl")
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "No followers found!"
                })
            }
            if (user.following.length === 0) {
                return res.status(400).json({
                    error: "User doesn't have any follower!"
                })
            }
            res.json({
                count: user.followingCount,
                followers: user.following
            })
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

// Updating User
exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.user._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, updatedUser) => {
            if (err) {
                return res.status(400).json({
                    error: "Failed to Update your data!"
                })
            }
            const parsedUser = parseUser(updatedUser)
            res.json(parsedUser)
        }
    )
}
// Following user
exports.followUser = (req, res) => {
    if (req.user._id == req.auth._id) {
        return res.status(400).json({
            error: "LOL! You wanna follow yourself?"
        })
    }

    User.findById(req.user._id, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: "Some Unknown Errors!"
            })
        }

        if (user.followers.filter(follower => follower.toString() == req.auth._id).length > 0) {
            return res.status(400).json({
                error: "You already followed the user"
            })
        }

        user.followers.unshift(req.auth._id)
        user.followersCount = user.followersCount + 1
        user.save()
        User.findById(req.auth._id, (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "Some Unknown Errors!"
                })
            }
            user.following.unshift(req.user._id)
            user.followingCount = user.followingCount + 1
            user.save().then(user => res.json({
                message: `Followed ${req.user.name} Successfully!`
            }))

        })
    })
}
// UnFollowing user (Async is Amazing!)
exports.unFollowUser = async (req, res) => {
    if (req.user._id == req.auth._id) {
        return res.status(400).json({
            error: "LOL! You wanna unfollow yourself?"
        })
    }
    try {
        await User.findByIdAndUpdate(req.user._id, { $pull: { followers: req.auth._id }, $inc: { followersCount: -1 } }, { useFindAndModify: false })
        await User.findByIdAndUpdate(req.auth._id, { $pull: { following: req.user._id }, $inc: { followingCount: -1 } }, { useFindAndModify: false })
        res.json({
            message: `Unfollowed ${req.user.name} Successfully!`
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    }
}