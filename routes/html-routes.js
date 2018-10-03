import express from "express";
import router from "./api-routes.js";


router.get("/", (req, res) => {
    res.render("clear");
});

router.get("*", (req, res) => {
    res.render("clear");
});

export default router;
    