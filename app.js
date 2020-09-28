// ENV Variables for Local use!
require("dotenv").config()

// Requiring Modules!
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser")
const cors = require("cors")

// Requiring Routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
const commentRoutes = require('./routes/comment')

// Seting up the DB Connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB CONNECTED")
}).catch((err) => {
    console.error(err)
})

// MiddleWares
app.use(express.json()) // To parse the sent json
app.use(cookieParser()) // To controll the cookies
app.use(cors()) // To controll the cookies

// Main Routes
app.use('/api', authRoutes) // Authentication Routes
app.use('/api', userRoutes) // User Routes
app.use('/api', productRoutes) // Product Routes
app.use('/api', commentRoutes) // Comment Routes

// Protected Route Error handler
/**
 * If there's not token, or the token is expired!
 */
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Unauthorized. Invalid token!' });
    }
    next()
});

// Port
const PORT = process.env.PORT || 8000

// Starting Server
app.listen(PORT, () => console.log(`Server running at port ${PORT}`))