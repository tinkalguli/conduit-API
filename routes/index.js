var express = require("express");
var Article = require("../models/Article");
var router = express.Router();
var User = require("../models/User");
var jwt = require("../modules/token");
var { userInfo } = require("./users");

// api documentation
router.get("/", (req, res, next) => {
  res
    .type("text/html")
    .status(200)
    .send(
      "<h1>Check out <a href='https://github.com/gothinkster/realworld/tree/master/api'>conduit api docs</a> for API info</h1>"
    );
});

// get current user
router.get("/user", jwt.verifyToken, async (req, res, next) => {
  try {
    var user = await User.findById(req.user.id);
    var token = await jwt.generateJWT(user);
    res.status(200).json({ user: { ...userInfo(user), token } });
  } catch (error) {
    next(error);
  }
});

// update current user
router.put("/user", jwt.verifyToken, async (req, res, next) => {
  try {
    var updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body.user,
      { new: true }
    );
    var token = await jwt.generateJWT(updatedUser);
    res.status(200).json({ user: { ...userInfo(updatedUser), token } });
  } catch (error) {
    next(error);
  }
});

// Get all tags
router.get("/tags", async (req, res, next) => {
  try {
    var tags = await Article.find({}).distinct("tagList");
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
