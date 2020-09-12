const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema For Comment
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
    replies: [{
        type: mongoose.Types.ObjectId,
        ref: "CommentReply"
    }],
    productId: {
        type: String,
        required: true
    },
    replyCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const ReplySchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 2000,
        required: true
    },
    commentId: {
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }
})
const CommentReply = mongoose.model("CommentReply", ReplySchema)
const Comment = mongoose.model("Comment", CommentSchema)
// Exporting Model
module.exports = { Comment, CommentReply }