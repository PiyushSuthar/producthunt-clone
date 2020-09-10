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

/**
 * I'm not able to remove the upvotes from user
 * TODO: Do it sooner!
 */
// productSchema.pre("deleteOne", function (next) {
//     const creatorId = this.getQuery()["creator"]
//     const productId = this.getQuery()["_id"]
//     mongoose.model("User").findOneAndUpdate({ _id: creatorId },
//         { $pull: { products: productId } },
//         { useFindAndModify: false },
//         (err, sucess) => {
//             if (err) {
//                 next(err)
//                 return
//             }
//             this.upvotes.array().forEach(async (id) => {
//                 await mongoose.model("User").findByIdAndUpdate(id, { $pull: { upvotes: productId } }, { useFindAndModify: false })
//             })
//             next()
//         })

// })


module.exports = mongoose.model("Product", productSchema)
