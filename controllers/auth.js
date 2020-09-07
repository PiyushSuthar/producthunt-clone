const User = require('../models/user')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

// Sign Up
exports.signup = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            param: errors.array()[0].param
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            console.error(err);
            return res.status(400).json({
                err: "Not able to save the user in DB."
            })
        }
        res.json({
            name: user.fullname,
            email: user.email,
            id: user._id,
            userImg: user.userImageUrl,
        })
        // res.json(user)
    })
}

// SignIN
exports.signin = (req, res) => {
    const { email, password } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            parram: errors.array()[0].param
        })
    }

    User.findOne({ _email: email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User dosn't exists!"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password dosen't match!"
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET)

        res.cookie("token", token, { expire: new Date() + 9999 })

        const { _id, fullname, email, role, userImageUrl } = user

        return res.json({
            token,
            user: {
                _id,
                name: fullname,
                email: email,
                role,
                userImageUrl
            }
        })
    })
}

// Sign Out
exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "User Logged Out Successfully!"
    })
}

// Protected Routes

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ['HS256']
})

exports.isAuthenticated = (req, res, next) => {
    let checker = req.user && req.auth && req.user._id === req.auth._id

    if (!checker) {
        return res.status(401).json({
            error: "You're not authorised to do this!"
        })
    }

    next()
}

exports.isAdmin = (req, res, next) => {
    if(req.user.role === 0){
        return res.status(400).josn({
            error: "You're not an Admin!"
        })
    }
    next()
}