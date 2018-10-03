import express from "express";
import cheerio from "cheerio";
import db from "../models";
import request from "request";
// import router from "./html-routes.js";
let router = express.Router();
let scrapedData = [];


router.get("/scrape", (req, res) => {
    console.log("Hi, GET is completed!");
    // First, we grab the body of the html with request
    request("https://www.thestar.com/news.html/", function(error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(html);

        // Now, we grab every h2 within an article tag, and do the following:
        $("span.story__headline").each(function(i, element) {
            // Save an empty result object
            const result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .text();
            result.link = $(this)
                .parent()
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            
            db.Article.findOne({title: result.title})
            .then(dbValidation => {
                if (!dbValidation) {
                    console.log("New");
                    db.Article.create(result)
                        .then(dbArticle => {
                            // View the added result in the console
                            // scrapedData.push(result);
                        })
                        .catch(err => // If an error occurred, send it to the clientfa
                            res.json(err));        
                        } else {
                            console.log("Duplicate");
                        }
                    })
                    
                });
                
                db.Article.find({saved: false})
                .then(function(allArticles) {
                    scrapedData = allArticles;
                console.log(`These are the scraped results: ${JSON.stringify(allArticles)}`);
                res.status(200).end();
    });
    });
});


router.get("/updated-scraped-results", (req, res) => {
    db.Article.find({saved: false})
    .then(function(refreshedArticles) {
        scrapedData = refreshedArticles;
        res.render("index", {scrapedItems: scrapedData});
    });
});

router.get("/scraped-results", (req, res) => {
    res.render("index", {scrapedItems: scrapedData});
});

router.put("/save-article", function(req, res) {
    db.Article.updateOne({_id: req.body.id}, {$set: {saved: true}})
    .then(function(result) {
        console.log(`Saved article ${req.body.id}`);
        res.status(200).end();
    }).catch(function(err) {
        res.json(err);
    });
});

// router.get("/clear", (req, res) => {
//     scrapedData
// })
export default router;

