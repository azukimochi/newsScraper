var express = require("express");
var router = require("./api-routes.js");

// Route for going to the home page
router.get("/", function(req, res) {
    res.render("clear");
});

// Catch all route that redirects to the home page 
router.get("*", function(req, res) {
    res.render("clear");
});

module.exports = router;
    