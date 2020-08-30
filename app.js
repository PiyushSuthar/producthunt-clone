require("dotenv").config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

// Routes
const authRoutes = require('./routes/auth')
const cookieParser = require("cookie-parser")

// DB Connection
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("DB CONNECTED")
}).catch((err)=>{
    console.error(err)
})

// Middle Wares
app.use(express.json())
app.use(cookieParser())

// Main Routes
app.use('/api', authRoutes)

// Protected Route Error handler
app.use((err, req, res,next) => {
	if (err.name === 'UnauthorizedError') {
		return res.status(401).json({ message: 'Unauthorized. Invalid token!' });
    }
    next()
});

// Port
const PORT = process.env.PORT || 3000

// Starting Server
app.listen(PORT, ()=> console.log(`Server running at port ${PORT}`))