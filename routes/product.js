const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const multer = require('multer')

// Setting Up Multer
const { ImageStore } = require('../controllers/multerMiddleware')
const upload = multer({ storage: ImageStore })

// Controllers
const {
    getProductById,
    getSingleProduct,
    getProductsByUsername,
    createProduct,
    upvoteProduct,
    unupvoteProduct,
    deleteProduct,
    updateProduct,
    getProductsForHome
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

// Get Products For Homepage
router.get("/homepage/products", getProductsForHome)


/**
 * POST Routes
 */
// Creating a product!
router.post("/product/create/:username", isSignedIn, isAuthenticated, [
    upload.fields([{ name: "logo", maxCount: 1 }, { name: "images", maxCount: 5 }]),
    check("name", "Name should be atleast 3 charc!").isLength(3),
    check("link", "Link must be a URL.").isURL(),
    check("description", "description have to be atleast 10 characters").isLength(10)
], createProduct)


/**
 * PUT Routes
 */
// Updating a Product
router.put("/product/update/:productId/:username", isSignedIn, isAuthenticated, upload.fields([{ name: "logo", maxCount: 1 }, { name: "images", maxCount: 5 }]), updateProduct)

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