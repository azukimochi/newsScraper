import express from "express";
import router from "./api-routes.js";

// Route for going to the home page
router.get("/", (req, res) => {
    res.render("clear");
});

// Catch all route that redirects to the home page 
router.get("*", (req, res) => {
    res.render("clear");
});

export default router;
    