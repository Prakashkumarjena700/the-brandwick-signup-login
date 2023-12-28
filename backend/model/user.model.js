const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    phone: String
}, {
    versionKey: false
})

const userModel = mongoose.model("users", userSchema)

module.exports = {
    userModel
}