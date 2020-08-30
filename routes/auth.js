const express = require('express')
const router = express.Router()
const {check} = require('express-validator')

const {signup, signin, signout, isSignedIn} = require('../controllers/auth')

// SignUP
router.post('/signup', [
    check('name', "Name Should be atleast 3 characters").isLength(3),
    check("username", "Username must be atleast 3 characters and unique").isLength(3),
    check("email", "Email is required").isEmail(),
    check("password", "Password should be atlest 8 characters").isLength(8)
], signup)

// SignIn
router.post('/signin', [
    check('email', "Email is Required").isEmail(),
    check("password", "Password field is required").isLength(8)
], signin)

// SignOUT
router.get('/signout', signout)


router.get('/test', isSignedIn, (req,res)=> res.json({err: "helloe"}))
module.exports = router