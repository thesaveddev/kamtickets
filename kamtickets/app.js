const express = require("express");
const app = express();
require('dotenv').config()
const db = require('./config/db');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const path = require('path')

const mailer = require('./utils/mailer');

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// set publc paths
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/uploads'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname + '/upload')));

app.use(bodyParser.urlencoded({
   limit: '50mb',
   extended: true,
   parameterLimit: 50000
}));


db.connect();
// mailer.validateSMTP()

//declare routes
const routes = require("./routes")

//use routes
app.use(routes)

app.listen(PORT, '0.0.0.0', () => console.log(`Listening on port ${PORT}`));

module.exports = app;
