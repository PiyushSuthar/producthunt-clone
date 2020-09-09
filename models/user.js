const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const { v1: uuidv1 } = require('uuid')

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxlength: 70,
        trim: true,
        unique: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    userImageUrl: {
        type: String
    },
    _email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true
    },
    userBio: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    products: [{
        type: mongoose.Types.ObjectId,
        ref: "Product"
    }],
    upvotes: [{
        type: mongoose.Types.ObjectId,
        ref: "Product"
    }],
    followers: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    followersCount: {
        type: Number,
        default: 0
    },
    following: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    followingCount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }]
}, { timestamps: true })

userSchema.virtual("password")
    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.encry_password = this.securePassword(password)
    })
    

userSchema.virtual("email")
    .set(function(email) {
        this._email = email
        this.userImageUrl = this.getGravatarUrl(email)
    }).get(function(){
        return this._email
    })

userSchema.virtual("fullname")
    .get(function() {
        return `${this.name} ${this.lastname}`
    })


userSchema.methods = {
    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encry_password
    },
    securePassword: function (plainPassword) {
        if (!plainPassword) return ""
        try {
            return crypto.createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest('hex')
        } catch (err) {
            return ""
        }
    },
    getGravatarUrl: function (email) {
        if (!email) return ''
        const emailMD5 = crypto.createHash('md5').update(email).digest('hex')
        return `https://www.gravatar.com/avatar/${emailMD5}`
    }
}

module.exports = mongoose.model("User", userSchema)