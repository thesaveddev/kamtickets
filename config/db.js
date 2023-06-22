const mongoose = require("mongoose");

exports.connect = () => {
    mongoose.connect(
        'mongodb+srv://nex-dexplore:tZyLSFGOFQiFDaFu@cluster0.dhbo540.mongodb.net/',
        { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
            if (err) {
                console.log(err)
                console.log("db connection failed")
            }
        })
        console.log("Connected to DB")
}