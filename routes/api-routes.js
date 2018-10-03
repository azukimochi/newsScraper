import express from "express";
import cheerio from "cheerio";
import db from "../models";
import request from "request";

let router = express.Router();
let scrapedData = [];
let savedData = [];

// Route for scraping the NY Times today's newspaper category 
router.get("/scrape", (req, res) => {
    request("https://www.nytimes.com/section/todayspaper", function (error, response, html) {
        const $ = cheerio.load(html);
        $(".story-body").each(function (i, element) {

            const result = {};

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
        .catch(err => res.json(err));
}

// Checking the database to see if a document with the same title exists 
function avoidDupes(result, req, res) {
    db.Article.findOne({ title: result.title })
        .then(dbValidation => {
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
        .then(dbArticle => {
            findArticles(dbArticle, req, res);
        })
        .catch(err => res.json(err));
};

// Route for showing all your saved articles on the saved web page
router.get("/saved", (req, res) => {
    db.Article.find({ saved: true })
        .then(function (savedArticles) {
            savedData = savedArticles;
            res.render("saved", { savedItems: savedData });
        }).catch(function (err) {
            res.json(err);
        })
});

// Route for updating the scraped results after saving an article 
router.get("/updated-scraped-results", (req, res) => {
    db.Article.find({ saved: false })
        .then(function (refreshedArticles) {
            scrapedData = refreshedArticles;
            res.render("index", { scrapedItems: scrapedData });
        }).catch(function (err) {
            res.json(err);
        });
});

// Route for rendering the scraped results 
router.get("/scraped-results", (req, res) => {
    res.render("index", { scrapedItems: scrapedData });
});

// Route for saving an article 
router.put("/save-article", (req, res) => {
    db.Article.updateOne({ _id: req.body.id }, { $set: { saved: true } })
        .then(function (result) {
            // console.log(`Saved article ${req.body.id}`);
            res.status(200).end();
        }).catch(function (err) {
            res.json(err);
        });
});

// Route for clearing the scraped results.
router.get("/clear", (req, res) => {
    scrapedData = [];
    res.render("clear");
});

// Route for deleting an article from the Saved web page
router.delete("/delete-article", (req, res) => {
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

export default router;

