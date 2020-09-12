const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Product Schema!
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    logo: {
        type: String,
        trim: true,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    images: [{
        type: String,
    }],
    link: {
        type: String,
        required: true
    },
    upvoteCount: {
        type: Number,
        default: 0
    },
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, { timestamps: true })

// Exporting Model
module.exports = mongoose.model("Product", productSchema)
