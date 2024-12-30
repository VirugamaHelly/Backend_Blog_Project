const express = require("express")
const db = require("./config/db")
const UserRouter = require("./Routes/UserRoutes")
const cookieParser = require('cookie-parser');
const path = require("path");
const blogrouter = require("./Routes/BlogRoutes");

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.use(cookieParser());

app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

app.use("/user",UserRouter)
app.use("/blog",blogrouter)



app.get("/",(req,res)=>{
    const user = null; 
    res.render("Navbar", { user});
})

app.listen(8991,()=>{
    console.log("server is running on 8991")
})