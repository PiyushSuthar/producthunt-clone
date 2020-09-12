const { Comment, CommentReply } = require('../models/comment')
const User = require('../models/user')
const Product = require('../models/product')

exports.getCommentById = (req, res, next, id) => {
    Comment.findById(id).exec((err, comment) => {
        if (err) {
            return res.status(400).json({
                error: "Can't find your comment!"
            })
        }
        req.comment = comment
        next()
    })
}

exports.createComment = (req, res) => {
    const comment = new Comment({ ...req.body, user: req.auth._id, productId: req.product._id })
    comment.save(async (err, comment) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to create comment!"
            })
        }
        await User.findByIdAndUpdate(req.auth._id, { $push: { comments: comment._id } }, { useFindAndModify: false })
        await Product.findByIdAndUpdate(req.product._id, { $push: { comments: comment._id } }, { useFindAndModify: false })
        comment.populate("user", "_id username name lastname userImageUrl ")
        res.json(comment)
    })
}

exports.replyToComment = (req, res) => {
    const reply = new CommentReply({ ...req.body, user: req.auth._id, commentId: req.comment._id })
    reply.save(async (err, reply) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to reply!"
            })
        }
        await Comment.findByIdAndUpdate(reply.commentId, { $push: { replies: reply._id }, $inc: { replyCount: +1 } }, { useFindAndModify: false })
        await User.findByIdAndUpdate(reply.user, { $push: { commentReplies: reply._id } }, { useFindAndModify: false })

        reply.populate("user", "_id name username userImageUrl")
        res.json(reply)
    })
}