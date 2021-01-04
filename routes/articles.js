var express = require("express");
var router = express.Router();
var Article = require("../models/Article");
var User = require("../models/User");
var jwt = require("../modules/token");
var { profileInfo } = require("./profiles");

// get all articles
router.get("/", jwt.verifyToken, async (req, res, next) => {
    try {
        var articles = await Article.find({});
        var articlesCount = await Article.find({}).count();
        res.status(200).json({ articles , articlesCount });
    } catch (error) {
        next(error);
    }
});

// get articles feed
router.get("/feed", jwt.verifyToken, async (req, res, next) => {
    try {
        var articles = await Article.find({ author : req.user.id });
        var articlesCount = await Article.find({ author : req.user.id }).count();
        res.status(200).json({ articles , articlesCount });
    } catch (error) {
        next(error);
    }
});

// create article
router.post("/", jwt.verifyToken, async (req, res, next) => {
    var slug = req.body.article.title.toLowerCase().replaceAll(" ", "-");
    req.body.article.slug = slug;
    req.body.article.author = req.user.id;
    try {
        var article = await (await Article.create(req.body.article)).execPopulate("author");
        res.status(201).json({ article : articleInfo(article, req.user) });
    } catch (error) {
        next(error);
    }
});

// get one article
router.get("/:slug", async (req, res, next) => {
    var slug = req.params.slug;
    try {
        var article = await (await Article.findOne({ slug })).execPopulate("author");
        res.status(200).json({ article : articleInfo(article) });
    } catch (error) {
        next(error);
    }
});

// update article
router.put("/:slug", jwt.verifyToken, async (req, res, next) => {
    if (req.body.article.title) {
        var slug = req.body.article.title.toLowerCase().replaceAll(" ", "-");
        req.body.article.slug = slug;
    }

    try {
        var article = await (await Article.findOneAndUpdate(req.params.slug, req.body.article, { new : true })).execPopulate("author");
        res.status(200).json({ article : articleInfo(article, req.user) });
    } catch (error) {
        next(error);
    }
});

// delete article
router.delete("/:slug", jwt.verifyToken, async (req, res, next) => {
    try {
        var article = await Article.findOneAndDelete(req.params.slug);
        res.status(200).json({ message : "Article deleted successfully" });
    } catch (error) {
        next(error);
    }
});

function articleInfo(article, currentUser) {
    return {
        slug : article.slug,
        title : article.title,
        description : article.description,
        body : article.body,
        tagList : article.tagList,
        author : profileInfo(article.author, currentUser),
        createdAt : article.createdAt,
        updatedAt : article.updatedAt
    }
}

module.exports = router;