const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
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