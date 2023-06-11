const mongoose = require("mongoose");

exports.connect = () => {
    mongoose.connect(
        `${process.env.DBURI}/${process.env.DBNAME}`,
        { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
            if (err) {
                console.log(err)
                console.log("db connection failed")
            }
        })
        console.log("Connected to DB")
}
