var express = require("express");
var router = express.Router();
var Article = require("../models/Article");

// get all articles
router.get("/", (req, res, next) => {
    Article.find({}, (err, articles) => {
        if (err) return next(err);
        res.json(articles);
    });
});

// create article
router.post("/new", (req, res, next) => {
    Article.create(req.body, (err, createdArticle) => {
        if (err) return next(err);
        res.json(createdArticle);
    });
});

// get one article
router.get("/:id", (req, res, next) => {
    var id = req.params.id;
    Article.findById(id, (err, article) => {
        if (err) return next(err);
        res.json(article);
    });
});

// update article
router.put("/:id", (req, res, next) => {
    var id = req.params.id;
    Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
        if (err) return next(err);
        res.json(updatedArticle);
    });
});

// delete article
router.delete("/:id", (req, res, next) => {
    var id = req.params.id;
    Article.findByIdAndDelete(id, (err, deletedArticle) => {
        if (err) return next(err);
        res.json(deletedArticle);
    });
});

module.exports = router;