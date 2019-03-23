//Dependencies
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');

//Require Models
var db = require('./models');

var PORT = process.env.PORT || 3000;

//Initialize Express
var app = express();

//Configure Middleware
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Makes static folder public
app.use(express.static('public'));

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

//Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

//Routes
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

//Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});