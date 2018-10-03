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
                            scrapedData.push(result);
                            console.log(`These are the scraped results: ${JSON.stringify(result)}`);
                        })
                        .catch(err => // If an error occurred, send it to the clientfa
                            res.json(err));
                    
                } else {
                    console.log("Duplicate");
                }
            })
            
        });
        res.json();
    });
});

router.get("/scraped-results", (req, res) => {
    res.render("index", {scrapedItems: scrapedData});
})
export default router;

