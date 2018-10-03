import express from "express";
import cheerio from "cheerio";
import db from "../models";
import request from "request";
// import router from "./html-routes.js";
let router = express.Router();
let scrapedData = [];
let savedData = [];

router.get("/scrape", (req, res) => {
    console.log("Hi, GET is completed!");
    // First, we grab the body of the html with request
    request("https://www.nytimes.com/section/todayspaper", function (error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(html);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".story-body").each(function (i, element) {
            // Save an empty result object
            const result = {};

            // Add the text and href of every link, and save them as properties of the result object
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
                // console.log(result);
            // Create a new Article using the `result` object built from scraping
            avoidDupes(result);
        });

        db.Article.find({ saved: false })
        .then(function (allArticles) {
            scrapedData = allArticles;
            console.log(`These are the scraped results: ${JSON.stringify(allArticles)}`);
            res.status(200).end();
        });
    });
});

function avoidDupes(result) {
    db.Article.findOne({ title: result.title })
        .then(dbValidation => {
            if (!dbValidation) {
                addArticle(dbValidation);
            } else {
                console.log("Duplicate");
            };
        });
}

function addArticle(dbValidation) {
    console.log("New");
    db.Article.create(dbValidation)
        .then(dbArticle => {
        })
        // .catch(err => // If an error occurred, send it to the clientfa
        //     res.json(err));
};



router.get("/saved", (req, res) => {
    db.Article.find({ saved: true })
        .then(function (savedArticles) {
            savedData = savedArticles;
            res.render("saved", { savedItems: savedData });
        }).catch(function (err) {
            res.json(err);
        })
});

router.get("/updated-scraped-results", (req, res) => {
    db.Article.find({ saved: false })
        .then(function (refreshedArticles) {
            scrapedData = refreshedArticles;
            res.render("index", { scrapedItems: scrapedData });
        }).catch(function (err) {
            res.json(err);
        });
});

router.get("/scraped-results", (req, res) => {
    res.render("index", { scrapedItems: scrapedData });
});

router.put("/save-article", (req, res) => {
    db.Article.updateOne({ _id: req.body.id }, { $set: { saved: true } })
        .then(function (result) {
            console.log(`Saved article ${req.body.id}`);
            res.status(200).end();
        }).catch(function (err) {
            res.json(err);
        });
});

router.get("/clear", (req, res) => {
    scrapedData = [];
    res.render("clear");
});

router.delete("/delete-article", (req, res) => {
    console.log("Id: " + req.body.id);
    db.Article.deleteOne({_id: req.body.id})
    .then(function (result) {
        console.log(`Deleted article ${req.body.id}`);
        res.status(200).end();
    }).catch(function (err) {
        res.json(err);
    });
});

router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, {note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  



export default router;

