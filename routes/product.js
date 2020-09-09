const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

// Controllers
const {
    getProductById,
    getSingleProduct,
    getProductsByUsername,
    createProduct,
    upvoteProduct,
    unupvoteProduct,
    deleteProduct
} = require('../controllers/product')
const { getUserByUsername } = require('../controllers/user')
const { isAdmin, isAuthenticated, isSignedIn } = require('../controllers/auth')

// Params
router.param("productId", getProductById)
router.param("username", getUserByUsername)

/**
 * GET Routes
 */
// Get Single Product
router.get("/product/:productId", getSingleProduct)

// Get Products by username
router.get("/products/:username", getProductsByUsername)


/**
 * POST Routes
 */
// Creating a product!
router.post("/product/create/:username", isSignedIn, isAuthenticated, [
    check("name", "Name should be atleast 3 charc!").isLength(3),
    check("link", "Link must be a URL.").isURL(),
    check("logo", "Logo is required").notEmpty(),
    check("description", "description have to be atleast 10 characters").isLength(10)
], createProduct)


/**
 * PATCH Routes
 */
// UPVOTE Product
router.patch("/product/upvote/:productId", isSignedIn, upvoteProduct)
router.patch("/product/unupvote/:productId", isSignedIn, unupvoteProduct)

/**
 * DELETE Routes
 */
router.delete("/product/delete/:productId/:username", isSignedIn, isAuthenticated, deleteProduct)


module.exports = router