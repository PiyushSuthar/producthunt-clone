const express = require('express')
const router = express.Router()

const { getProductById } = require('../controllers/product')
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')
const { createComment, getCommentById, replyToComment } = require('../controllers/comment')

// Params
router.param("productId", getProductById)
router.param("commentId", getCommentById)

/**
 * GET Routes
 */
// Looks like GET routes are not needed for Comments. They are populated directly in Products.

/**
 * POST Routes
 */
// Creating a comment!
router.post("/comment/create/:productId", isSignedIn, createComment)

// Replying a comment!
/**
 * Depth should be level 1 :(
 * I don't want anyone to talk too much ;)
 */
router.post("/comment/reply/:commentId", isSignedIn, replyToComment)

 module.exports = router