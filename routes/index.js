var express = require('express');
var Article = require('../models/Article');
var router = express.Router();
var User = require("../models/User");
var jwt = require("../modules/token");
var { userInfo } = require("./users");

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.status(200).json({ message : "Welcome to conduit API"});
});

// get current user
router.get('/user', jwt.verifyToken, async (req, res, next) => {
  try {
    var user = await User.findById(req.user.id);
    res.status(200).json({ user : userInfo(user) });
  } catch (error) {
    next(error);
  }
});

// update current user
router.put('/user', jwt.verifyToken, async (req, res, next) => {
  try {
    var updatedUser = await User.findByIdAndUpdate(req.user.id, req.body.user, { new : true });
    res.status(200).json({ user : userInfo(updatedUser) });
  } catch (error) {
    next(error);
  }
});

// Get all tags
router.get("/tags", async (req, res, next) => {
  try {
    var articles = await Article.find({});

    res.status(200).json(
      { tags : articles.map(article => article.tagList)
      .reduce((a, c) => a.concat(c), [])});

  } catch (error) {
    next(error);
  }
});

module.exports = router;
