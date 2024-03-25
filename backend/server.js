const express=require("express");
const chats = require("./data");
const app=express();
const dotenv=require("dotenv")
const cors = require('cors');
const connectionDB = require("./config/db");
const colors=require("colors")
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes")
const { notFound, errorHandler } = require("./middleware/errorMiddleware");



dotenv.config();
app.use(cors());

app.use(express.json());

connectionDB();
app.get("/",(req,res)=>{
    res.send("get response from web")
})

app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)
app.use(notFound)
app.use(errorHandler)

const port=process.env.PORT || 6000;

app.listen(port,console.log(`server running on port ${port}`.yellow.bold))