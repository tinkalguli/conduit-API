var express = require("express");
const { populate } = require("../models/Article");
var router = express.Router();
var Article = require("../models/Article");
var User = require("../models/User");
var Comment = require("../models/Comment");
var jwt = require("../modules/token");
var { profileInfo } = require("./profiles");

// get all articles
router.get("/", jwt.verifyToken, async (req, res, next) => {
    var query = req.query;
    var filter = {};
    var limit = 20;
    var offset = 0;
    
    if(query.tag) filter.tagList = { $in : [query.tag] };
    if(query.limit) limit = +query.limit;
    if(query.offset) offset = +query.offset;

    try {
        if(query.author) {
            var author = await User.findOne({ username : query.author });
            filter.author = author.id;
        }

        if(query.favorited) {
            var user = await User.findOne({ username : query.favorited });
            filter.favorites = { $in : [user.id] };
        }

        var articles = await Article.find(filter).populate("author")
            .skip(offset).limit(limit).sort({ updatedAt : -1 });

        var articlesCount = await Article.find(filter)
            .skip(offset).limit(limit).count();

        res.status(200)
            .json({ articles : articles
            .map(article=> articleInfo(article, req.user)) , articlesCount });

    } catch (error) {
        next(error);
    }
});

// get articles feed
router.get("/feed", jwt.verifyToken, async (req, res, next) => {
    var query = req.query;
    var limit = 20;
    var offset = 0;

    if(query.limit) limit = +query.limit;
    if(query.offset) offset = +query.offset;

    try {
        var articles = await Article.find({ author : req.user.id })
            .populate("author").skip(offset).limit(limit)
            .sort({ updatedAt : -1 });

        var articlesCount = await Article.find({ author : req.user.id })
            .skip(offset).limit(limit).count();

        res.status(200)
            .json({ articles : articles
            .map(article=> articleInfo(article, req.user)) , articlesCount });

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
        var article = await (await Article.create(req.body.article))
            .execPopulate("author");

        res.status(201).json({ article : articleInfo(article, req.user) });
    } catch (error) {
        next(error);
    }
});

// get one article
router.get("/:slug", async (req, res, next) => {
    var slug = req.params.slug;

    try {
        var article = await Article.findOne({ slug }).populate("author");
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

    var slug = req.params.slug;

    try {
        var article = await Article.findOneAndUpdate({ slug }, req.body.article, { new : true })
            .populate("author");

        res.status(200).json({ article : articleInfo(article, req.user) });
    } catch (error) {
        next(error);
    }
});

// delete article
router.delete("/:slug", jwt.verifyToken, async (req, res, next) => {
    var slug = req.params.slug;
    try {
        var article = await Article.findOneAndDelete({ slug });
        res.status(200).json({ message : "Article deleted successfully" });
    } catch (error) {
        next(error);
    }
});


// Get all comments of an article
router.get("/:slug/comments", jwt.verifyToken, async (req, res, next) => {
    var slug = req.params.slug;

    try {
        var article = await Article.findOne({ slug }).populate("comments");
        res.status(200).json({ comments : article.comments });
    } catch (error) {
        next(error);
    }
});

// create a comment
router.post("/:slug/comments", jwt.verifyToken, async (req, res, next) => {
    var slug = req.params.slug;
    var author = req.user.id;
    req.body.comment.author = author;

    try {
        var comment = await Comment.create(req.body.comment);
        var article = await Article.findOneAndUpdate(
            { slug }, { $addToSet : { comments : comment.id } });

        res.status(200).json({ comment });
    } catch (error) {
        next(error);
    }
});

// create a comment
router.delete("/:slug/comments/:id", jwt.verifyToken, async (req, res, next) => {
    var slug = req.params.slug;
    var commentId = req.params.id;

    try {
        var comment = await Comment.findByIdAndDelete(commentId);
        var article = await Article.findOneAndUpdate(
            { slug }, { $pull : { comments : commentId } });

        res.status(200).json({ message : "Comment has been deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// favorite article
router.post("/:slug/favorite", jwt.verifyToken, async (req, res, next) => {
    var slug = req.params.slug;

    try {
        var article = await Article.findOneAndUpdate(
            { slug }, { $addToSet : { favorites : req.user.id }}, { new : true })
            .populate("author");

        res.status(200).json({ article : {...articleInfo(article, req.user)} });
    } catch (error) {
        next(error);
    }
});

// unfavorite article
router.delete("/:slug/favorite", jwt.verifyToken, async (req, res, next) => {
    var slug = req.params.slug;

    try {
        var article = await Article.findOneAndUpdate(
            { slug }, { $pull : { favorites : req.user.id }}, { new : true })
            .populate("author");

        res.status(200).json({ article : {...articleInfo(article, req.user)}});
    } catch (error) {
        next(error);
    }
});

function articleInfo(article, currentUser) {
    var isFavorite = currentUser ? article.favorites.includes(currentUser.id) : false;

    return {
        slug : article.slug,
        title : article.title,
        description : article.description,
        body : article.body,
        tagList : article.tagList,
        author : profileInfo(article.author, currentUser),
        favorited : isFavorite,
        favoritesCount : article.favorites.length,
        createdAt : article.createdAt,
        updatedAt : article.updatedAt
    }
}

module.exports = router;