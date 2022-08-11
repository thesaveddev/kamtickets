const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
username: {
        type: String,
        unique: true,
        required: true
},
email: {
    type: String,
    unique: true,
    required: true
},
fullname: {
    type: String,
    unique: false,
    required: true
    },
phone: {
    type: String,
    unique: true,
    required: true
},
sbu: {
    type: String,
    required: true
},
role: {
    type: String,
    enum: ["ADMIN"],
    default: "ADMIN"
    },
password: {
    type: String,
    required: true
    }
})

module.exports = mongoose.model('User', userSchema);