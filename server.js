import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import db from "./models";

const PORT = 5000;

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
import exphbs from "express-handlebars";

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//Routes
import router from "./routes/html-routes";
app.use(router);

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
