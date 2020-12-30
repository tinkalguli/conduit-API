var express = require('express');
var router = express.Router();
var User = require("../models/User");
var jwt = require("../modules/token");

// get current user profile
router.get('/:username', jwt.verifyToken, async (req, res, next) => {
    try {
      var username = req.params.username;
      var user = await User.findOne({ username });
      var currentUser = await User.findById(req.user.userId);
      var isFollowing = currentUser.followings.includes(user.id);
      res.status(200).json({ profile : {...profileInfo(user), following : isFollowing } });
    } catch (error) {
      next(error);
    }
});

// follow a user
router.post('/:username/follow', jwt.verifyToken, async (req, res, next) => {
    try {
      var username = req.params.username;
      var user = await User.findOne({ username });
      var currentUser = await User.findByIdAndUpdate(req.user.userId, { $addToSet : { followings : user.id }}, { new : true });
      var isFollowing = currentUser.followings.includes(user.id);
      res.status(200).json({ profile : {...profileInfo(user), following : isFollowing } });
    } catch (error) {
      next(error);
    }
});

// unfollow a user
router.delete('/:username/follow', jwt.verifyToken, async (req, res, next) => {
    try {
      var username = req.params.username;
      var user = await User.findOne({ username });
      var currentUser = await User.findByIdAndUpdate(req.user.userId, { $pull : { followings : user.id }}, { new : true });
      var isFollowing = currentUser.followings.includes(user.id);
      res.status(200).json({ profile : {...profileInfo(user), following : isFollowing } });
    } catch (error) {
      next(error);
    }
});

function profileInfo(user) {
    return {
        username : user.username,
        bio : user.bio,
        image : user.image
    }
}

module.exports = {router, profileInfo};