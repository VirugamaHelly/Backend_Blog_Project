const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String
    },
    
})

const usermodel = new mongoose.model("User", userSchema)

module.exports = usermodel