const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const RedisStore = require("connect-redis")(session)
require('dotenv').config()
const dbConn = require('./config/dbConn')
const app = express()

//connect to redis
const { createClient } = require("redis")
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)

//use session and redis
app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: "my secret key",
      resave: false,
    })
  )

dbConn()



app.use(express.json())



app.use('/user', require('./routes/user'))

app.listen(process.env.PORT,()=>{console.log(`server is running on port ${process.env.PORT}`)})

