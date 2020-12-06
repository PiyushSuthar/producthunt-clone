const express = require('express')
const router = express.Router()

const { getProductById } = require('../controllers/product')
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth')
const { createComment, getCommentById, replyToComment, deleteTheComment, getCommentsByProduct } = require('../controllers/comment')

// Params
router.param("productId", getProductById)
router.param("commentId", getCommentById)

/**
 * GET Routes
 */
// Getting Comments by Product id, With pagination
router.get("/comments/product/:productId", getCommentsByProduct)

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


// Delete
router.delete("/comment/delete/:commentId", isSignedIn, deleteTheComment)

module.exports = router