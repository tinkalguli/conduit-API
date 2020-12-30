var express = require("express");
var router = express.Router();
var Article = require("../models/Article");
var User = require("../models/User");
var jwt = require("../modules/token");
var { profileInfo } = require("./profiles");

// get all articles
router.get("/", (req, res, next) => {
    res.send("All articles")
});

// get articles feed
router.get("/feed", (req, res, next) => {
    res.send("Articles feed")
});

// create article
router.post("/", jwt.verifyToken, async (req, res, next) => {
    var slug = req.body.article.title.toLowerCase().replaceAll(" ", "-");
    req.body.article.slug = slug;
    req.body.article.author = req.user.userId;
    try {
        var article = await (await Article.create(req.body.article)).execPopulate("author");
        article.author = profileInfo(article.author);
        res.status(201).json({ article : { ...articleInfo(article) } });
    } catch (error) {
        next(error);
    }
});

// get one article
router.get("/:slug", async (req, res, next) => {
    var slug = req.params.slug;
    try {
        var article = await (await Article.findOne({ slug })).execPopulate("author");
        article.author = {};
        res.status(200).json({ article : articleInfo(article) });
    } catch (error) {
        next(error);
    }
});

function articleInfo(article) {
    return {
        slug : article.slug,
        title : article.title,
        description : article.description,
        body : article.body,
        tagList : article.tagList,
        author : article.author,
        createdAt : article.createdAt,
        updatedAt : article.updatedAt
    }
}
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