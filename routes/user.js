const express = require('express')
const router = express.Router()
const { getUserById, getSingleUser, getAllUsers } = require('../controllers/user')

// Parmas
router.param("username", getUserById)

/**
 * GET ROUTES
 */
// Getting all the users
router.get('/users', getAllUsers)

// Getting a single user
router.get('/user/:username', getSingleUser)

// Getting user Followers
router.get('/user/:username/followers')

// Get all the users user is following
router.get('/user/:username/following')

// Getting user's all Products
router.get('/user/:username/products')

// Getting user's single product

// Updating a User!

// Deleting a User

// Following a User

module.exports = router