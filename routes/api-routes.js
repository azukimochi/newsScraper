var express = require("express");
var cheerio = require("cheerio");
var db = require("../models");
var request = require("request");

var router = express.Router();
var scrapedData = [];
var savedData = [];

// Route for scraping the NY Times today's newspaper category 
router.get("/scrape", function(req, res) {
    request("https://www.nytimes.com/section/todayspaper", function(error, response, html) {
        var $ = cheerio.load(html);
        $(".story-body").each(function(i, element) {

            var result = {};

            result.title = $(this)
                .children("h2")
                .children("a")
                .text();
            result.link = $(this)
                .children("h2")
                .children("a")
                .attr("href");
            result.summary = $(this)
                .children("p.summary")
                .text();

            avoidDupes(result, req, res);
        });

    });
});

// Querying all the unsaved scraped articles to appear on the page 
function findArticles(dbArticle, req, res) {
    db.Article.find({ saved: false })
        .then(function (allArticles) {
            scrapedData = allArticles;
            // console.log(`These are the scraped results: ${JSON.stringify(allArticles)}`);
            res.status(200).end();
        })
        .catch(function(err) {
            return res.json(err);
        });
}

// Checking the database to see if a document with the same title exists 
function avoidDupes(result, req, res) {
    db.Article.findOne({ title: result.title })
        .then(function(dbValidation) {
            if (!dbValidation) {
                addArticle(dbValidation, req, res);
            } else {
                // console.log("Duplicate");
            };
        });
}

// Adding a new article that's been scraped into the database 
function addArticle(dbValidation, req, res) {
    // console.log("New");
    db.Article.create(dbValidation)
        .then(function(dbArticle) {
            findArticles(dbArticle, req, res);
        })
        .catch(function(err) {
            res.json(err);
        });
};

// Route for showing all your saved articles on the saved web page
router.get("/saved", function(req, res) {
    db.Article.find({ saved: true })
        .then(function (savedArticles) {
            savedData = savedArticles;
            res.render("saved", { savedItems: savedData });
        }).catch(function (err) {
            res.json(err);
        });
});

// Route for updating the scraped results after saving an article 
router.get("/updated-scraped-results", function(req, res) {
    db.Article.find({ saved: false })
        .then(function (refreshedArticles) {
            scrapedData = refreshedArticles;
            res.render("index", { scrapedItems: scrapedData });
        }).catch(function (err) {
            res.json(err);
        });
});

// Route for rendering the scraped results 
router.get("/scraped-results", function(req, res) {
    res.render("index", { scrapedItems: scrapedData });
});

// Route for saving an article 
router.put("/save-article", function(req, res) {
    db.Article.updateOne({ _id: req.body.id }, { $set: { saved: true } })
        .then(function (result) {
            // console.log(`Saved article ${req.body.id}`);
            res.status(200).end();
        }).catch(function (err) {
            res.json(err);
        });
});

// Route for clearing the scraped results.
router.get("/clear", function(req, res) {
    scrapedData = [];
    res.render("clear");
});

// Route for deleting an article = require( the Saved web page
router.delete("/delete-article", function(req, res) {
    // console.log("Id: " + req.body.id);
    db.Article.deleteOne({ _id: req.body.id })
        .then(function (result) {
            // console.log(`Deleted article ${req.body.id}`);
            res.status(200).end();
        }).catch(function (err) {
            res.json(err);
        });
});

// Route for selecting an article and populating its notes. 
router.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

module.exports = router;

