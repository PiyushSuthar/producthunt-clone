const { Comment, CommentReply } = require('../models/comment')
const User = require('../models/user')
const Product = require('../models/product')
const { paginationForApi } = require('../Utlis')

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

exports.getCommentsByProduct = (req, res) => {
    const { pageNo, perPage } = paginationForApi(req)
    Comment.find({ productId: req.product._id })
        .skip(parseInt(pageNo))
        .limit(parseInt(perPage))
        .populate("user", "_id username name lastname userImageUrl")
        .populate({
            path: "replies",
            populate: {
                path: "user",
                select: "_id username name lastname userImageUrl"
            }
        })
        .exec((err, comments) => {
            if (err) {
                return res.status(400).json({
                    error: "Couldn't Find Any Comments",
                    message: err
                })
            }
            if (comments.length === 0) {
                return res.json({
                    isLastPage: true
                })
            }
            res.json(comments)
        })
}

exports.createComment = (req, res) => {
    const comment = new Comment({ ...req.body, user: req.auth._id, productId: req.product._id })
    comment.save(async (err, comment) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to create comment!",
                message: err
            })
        }
        await User.findByIdAndUpdate(req.auth._id, { $push: { comments: comment._id } }, { useFindAndModify: false })
        await Product.findByIdAndUpdate(req.product._id, { $push: { comments: comment._id } }, { useFindAndModify: false })
        let populatedComment = await comment.populate("user", "_id username name lastname userImageUrl ").execPopulate()
        res.json(populatedComment)
    })
}

exports.replyToComment = (req, res) => {
    const reply = new CommentReply({ ...req.body, user: req.auth._id, commentId: req.comment._id })
    reply.save(async (err, reply) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to reply!",
                message: err
            })
        }
        await Comment.findByIdAndUpdate(reply.commentId, { $push: { replies: reply._id }, $inc: { replyCount: +1 } }, { useFindAndModify: false })
        await User.findByIdAndUpdate(reply.user, { $push: { commentReplies: reply._id } }, { useFindAndModify: false })

        let populatedReply = await reply.populate("user", "_id name username userImageUrl").execPopulate()
        res.json(populatedReply)
    })
}

exports.deleteTheComment = (req, res) => {
    Comment.findByIdAndDelete(req.comment._id, { useFindAndModify: false }, async (err, comment) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete Comment!",
                message: err
            })
        }
        // Removing Replies
        comment.replies.map(async (reply, index) => {
            await CommentReply.findByIdAndDelete(reply._id, async (err, reply) => {
                await User.findByIdAndUpdate(relpy.user, { $pull: { commentReplies: reply._id } }, { useFindAndModify: false })
            })

            // Removing Referece from user's Data
            await User.findByIdAndUpdate(comment.user, { $pull: { comments: comment._id } }, { useFindAndModify: false })

            res.json({
                success: true,
            })
        })
    })
}