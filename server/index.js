require('dotenv').config()
const express = require('express') 
const app = express()
const cors = require('cors')
const connection = require('./db') 
const userRoutes = require("./routers/users")
const authRoutes = require("./routers/auth")
const tokenVerification = require('./middleware/tokenVerification')
connection()
//middleware
app.use(express.json())
app.use(cors())

app.get("/api/users/",tokenVerification)
//routers
//the structure is crucial
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes) //only get method doesn't require token
app.use("/api/users/first", userRoutes)
app.use("/api/users/delete", userRoutes)
app.use("/api/users/addFriend", userRoutes)


const port = process.env.PORT || 8080

app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))
