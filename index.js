const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const dbConn = require('./config/dbConn')
const app = express()

dbConn()

app.use(express.json())
app.use('/user', require('./routes/user'))

mongoose.connection.once('open', ()=>{
    console.log('DB connected')
    app.listen(process.env.PORT,()=>{console.log(`server is running on port ${process.env.PORT}`)})
})
