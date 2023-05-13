const express = require("express")
const { connection } = require("./config/db")
require("dotenv").config()
const cors = require("cors")
const userRouter = require("./routes/user.routes")
const blogRouter = require("./routes/blogs.routes")

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api",userRouter)
app.use("/api",blogRouter)
app.listen(`${process.env.LOCAL_HOST}`,async()=>{
    try {
        await connection
        console.log("db is connected")
    } catch (error) {
        console.log("db is not connected")
    }

    console.log(`running on ${process.env.LOCAL_HOST}`)
})