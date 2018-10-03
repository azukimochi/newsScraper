import express from "express";
import router from "./api-routes.js";


router.get("/", (req, res) => {
    res.render("index");
});

router.get("*", (req, res) => {
    res.render("index");
});

// router.use("/api-routes", apiRouter);

export default router;
    