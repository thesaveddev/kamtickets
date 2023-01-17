const mongoose = require('mongoose');

settingsSchema = new mongoose.Schema({
    companyname: {
        type: String
    },
    logo: {
        type: String
    },
    theme: {
        type: String
    },
    host: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    secure: {
        type: String,
        default: false
    },
    user: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Settings', settingsSchema)