const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    image: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("users", userSchema)