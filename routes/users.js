var express = require("express");
var router = express.Router();
var User = require("../models/User");
var jwt = require("../modules/token");

// register
router.post("/", async (req, res, next) => {
  try {
    var user = await User.create(req.body.user);
    var token = await jwt.generateJWT(user);
    res.status(201).json({ user: { ...userInfo(user), token } });
  } catch (error) {
    next(error);
  }
});

// user login
router.post("/login", async (req, res, next) => {
  try {
    var password = req.body.user.password;
    var email = req.body.user.email;
    var user = await User.findOne({ email });

    if (user?.verifyPassword(password)) {
      var token = await jwt.generateJWT(user);
      res.status(200).json({ user: { ...userInfo(user), token } });
    } else {
      res
        .status(422)
        .json({ errors: { body: ["Invalid Email or Password"] } });
    }
  } catch (error) {
    next(error);
  }
});

function userInfo(user) {
  return {
    email: user.email,
    username: user.username,
    bio: user.bio,
    image: user.image,
  };
}

module.exports = { router, userInfo };
