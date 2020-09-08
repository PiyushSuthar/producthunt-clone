const express = require('express')
const router = express.Router()
const { getSingleUser, 
    getAllUsers, 
    getUserByUsername, 
    getUserFollowers, 
    getUserFollowing, 
    updateUser, 
    followUser, 
    unFollowUser } = require('../controllers/user')
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')

// Parmas
router.param("username", getUserByUsername)

/**
 * GET ROUTES
 */
// Getting all the users
router.get('/users/:username', isSignedIn, isAdmin, getAllUsers)

// Getting a single user
router.get('/user/:username', getSingleUser)

// Getting user Followers
router.get('/user/:username/followers', getUserFollowers)

// Get all the users user is following
router.get('/user/:username/following', getUserFollowing)

/**
 * PUT Routes
 */
// Updating a User!
router.put('/user/:username', isSignedIn, isAuthenticated, updateUser)

// Follow paths
router.patch('/user/follow/:username', isSignedIn, followUser)
router.patch('/user/unfollow/:username', isSignedIn, unFollowUser)

/**
 * DELETE Routes
 */
// Deleting a User

module.exports = router