var express = require('express');
var router = express.Router();
var User = require("../models/User");
var jwt = require("../modules/token");

// get user profile
router.get('/:username', jwt.verifyTokenOptional, async (req, res, next) => {
    try {
      var username = req.params.username;
      var user = await User.findOne({ username });
      res.status(200).json({ profile : profileInfo(user, req.user) });
    } catch (error) {
      next(error);
    }
});

// follow a user
router.post('/:username/follow', jwt.verifyToken, async (req, res, next) => {
    try {
      var username = req.params.username;
      var user = await User.findOne({ username });
      var currentUser = await User.findByIdAndUpdate(req.user.id, { $addToSet : { followings : user.id }}, { new : true });
      res.status(200).json({ profile : profileInfo(user, currentUser) });
    } catch (error) {
      next(error);
    }
});

// unfollow a user
router.delete('/:username/follow', jwt.verifyToken, async (req, res, next) => {
    try {
      var username = req.params.username;
      var user = await User.findOne({ username });
      var currentUser = await User.findByIdAndUpdate(req.user.id, { $pull : { followings : user.id }}, { new : true });
      res.status(200).json({ profile : profileInfo(user, currentUser) });
    } catch (error) {
      next(error);
    }
});

function profileInfo(user, currentUser) {
    var isFollowing = currentUser ? currentUser.followings.includes(user.id) : false;
    return {
        username : user.username,
        bio : user.bio,
        image : user.image,
        following : isFollowing
    }
}

module.exports = {router, profileInfo};