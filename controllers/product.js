const Product = require('../models/product')
const User = require('../models/user')
const { validationResult } = require('express-validator')

// PARAMS
exports.getProductById = (req, res, next, id) => {
    Product.findById(id).
        populate("creator", "_id username name lastname userImageUrl ").
        populate("upvotes", "_id username name lastname userImageUrl").
        populate({
            path: "comments",
            populate: [
                {
                    path: "user",
                    select: "_id username name lastname userImageUrl"
                },
                {
                    path: "replies",
                    populate: {
                        path: "user",
                    select: "_id username name lastname userImageUrl"
                    }
                }
            ]
        }).
        exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Looks like the product is not available! :(",
                    message: err
                })
            } else {
                req.product = product
                next()
            }
        })
}

/**
 * GET Routes
 */
// Get Single Product
exports.getSingleProduct = (req, res) => {
    res.json(req.product)
}
// Get user's products
exports.getProductsByUsername = (req, res) => {
    if (req.user.products.length > 0) {
        Product.find({ creator: req.user._id }).
            populate("creator", "_id username name lastname userImageUrl ").
            populate("upvotes", "_id username name lastname userImageUrl").
            select("-comments").
            exec((err, products) => {
                if (err) {
                    return res.status(400).json({
                        error: "Can't find what you want!",
                        message: err
                    })
                }
                return res.json(products)
            })
    } else {
        return res.status(400).json({
            error: `${req.user.name} doesn't have any product! :(`
        })
    }
}

/**
 * POST Routes
 */
// Creating Product
exports.createProduct = (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg,
            parram: errors.array()[0].param
        })
    }

    const product = new Product({ ...req.body, creator: req.auth._id })
    product.save(async (err, createdProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Not able to save the product!"
            })
        }
        await User.findByIdAndUpdate(req.user._id, { $push: { products: createdProduct._id } }, { useFindAndModify: false })
        return res.json(createdProduct)
    })
}

/**
 * PUT Routes
 */
// Updating a product
exports.updateProduct = (req, res) => {
    Product.findOneAndUpdate(
        { _id: req.product._id },
        { $set: req.body },
        { useFindAndModify: false, new: true })
        .populate("creator", "_id username name lastname userImageUrl ")
        .populate("upvotes", "_id username name lastname userImageUrl")
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Failed To Update Product! :("
                })
            }
            res.json(product)
        })
}

/**
 * PATCH Routes
 */
// Upvoting the Product
exports.upvoteProduct = async (req, res) => {
    if (req.product.upvotes.filter(prod => prod._id == req.auth._id).length > 0) {
        return res.status(400).json({
            error: "You have already upvoted the product"
        })
    }
    try {
        await Product.findByIdAndUpdate(req.product._id, { $push: { upvotes: req.auth._id }, $inc: { upvoteCount: +1 } }, { useFindAndModify: false })
        await User.findByIdAndUpdate(req.auth._id, { $push: { upvotes: req.product._id } }, { useFindAndModify: false })
        res.json({
            success: true,
            error: false,
            message: "Upvoted Product Successfully!"
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            error: true,
            message: err
        })
    }
}
// un Upvoting the Product
exports.unupvoteProduct = async (req, res) => {
    if (req.product.upvotes.filter(prod => prod._id == req.auth._id).length === 0) {
        return res.status(400).json({
            error: "You have to upvote it to unUpvote!"
        })
    }

    try {
        await Product.findByIdAndUpdate(req.product._id, { $pull: { upvotes: req.auth._id }, $inc: { upvoteCount: -1 } }, { useFindAndModify: false })
        await User.findByIdAndUpdate(req.auth._id, { $pull: { upvotes: req.product._id } }, { useFindAndModify: false })
        res.json({
            success: true,
            error: false,
            message: "unUpvoted Product Successfully!"
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            error: true,
            message: err
        })
    }
}

/**
 * DELETE routes
 */

exports.deleteProduct = async (req, res) => {
    try {
        await Product.deleteOne({ _id: req.product._id })
        res.json({
            success: true
        })
    } catch (err) {
        res.status(400).json({
            error: true,
            message: err
        })
    }
}