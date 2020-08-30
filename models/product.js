const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
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
})



productSchema.methods = {
    setUpvoteCount: function(p) {
        this.upvoteCount = this.upvotes.length
    }
}

module.exports = mongoose.model("Product", productSchema)
