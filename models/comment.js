const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 2000,
        required: true
    },
    replies: {
        type: Array,
        default: []
    },
    productId: {
        type: String,
        required: true
    },
    replyCount: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("comment", CommentSchema)