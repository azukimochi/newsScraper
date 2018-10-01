var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// var axios = require("axios");
// var logger = require("morgan");
// var request = require("request");
// var cheerio = require("cheerio");
var db = require("./models");

var PORT = 4000;

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
// app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//Routes
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });