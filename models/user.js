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
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userBio: {
        type: String,
        trim: true
    },
    encry_password: {
        trype: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    products: {
        type: Array,
        default: []
    },
    hunts: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    followersCount: {
        type: Number,
        default: 0
    },
    following: {
        type: Array,
        default: []
    },
    followingCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

userSchema.virtual("password")
    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.encry_password = this.securePassword(password)
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
    }
}

module.exports = mongoose.model("User", userSchema)