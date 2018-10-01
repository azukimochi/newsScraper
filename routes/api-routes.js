var express = require("express");
// var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
var request = require("request");

module.exports = function(app) {
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with request
        request("https://www.thestar.com/news.html/", function(error, response, html) {
          // Then, we load that into cheerio and save it to $ for a shorthand selector
          var $ = cheerio.load(html);
      
          // Now, we grab every h2 within an article tag, and do the following:
          $("span.story__headline").each(function(i, element) {
            // Save an empty result object
            var result = {};
      
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
              .text();
            result.link = $(this)
              .parent()
              .attr("href");
      
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
              .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function(err) {
                // If an error occurred, send it to the clientfa
                return res.json(err);
              });
          });
      
          // If we were able to successfully scrape and save an Article, send a message to the client
          res.render("Scrape Complete");
        });
      });
};