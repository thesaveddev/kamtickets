const mongoose = require('mongoose');
staffSchema = new mongoose.Schema({
    staffname: {
        type: String,
        required: true
    },
    sbu: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
    type: String,
    enum: ["ADMIN", "STAFF"],
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Staff', staffSchema);