const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://virugamahelly:student@cluster0.hz7mg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Database is connected")
})

module.exports = db;