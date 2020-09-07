const express = require('express')
const router = express.Router()
const { getSingleUser, getAllUsers, getUserByUsername, getUserFollowers, getUserFollowing } = require('../controllers/user')
const { isSignedIn, isAuthenticated } = require('../controllers/auth')

// Parmas
router.param("username", getUserByUsername)

/**
 * GET ROUTES
 */
// Getting all the users
router.get('/users', isSignedIn, getAllUsers)

// Getting a single user
router.get('/user/:username', isSignedIn, getSingleUser)

// Getting user Followers
router.get('/user/:username/followers', isSignedIn, getUserFollowers)

// Get all the users user is following
router.get('/user/:username/following',isSignedIn, getUserFollowing)

// Updating a User!

// Deleting a User

// Following a User

module.exports = router