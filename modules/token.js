var jwt = require("jsonwebtoken");
var User = require("../models/User");

exports.generateJWT = async (user) => {
  var payload = { userId: user.id, email: user.email };
  var token = await jwt.sign(payload, process.env.SECRET);
  return token;
};

exports.verifyToken = async (req, res, next) => {
  var token = req.headers.authorization;
  if (token) {
    try {
      var payload = await jwt.verify(token, process.env.SECRET);
      var user = await User.findById(payload.userId);
      req.user = user;
      return next();
    } catch (error) {
      res.status(401).json({ errors: { body: [error.toString()] } });
    }
  } else {
    res
      .status(401)
      .json({ errors: { body: ["token required for validation"] } });
  }
};

exports.verifyTokenOptional = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next();
  }

  var token = req.headers.authorization;
  if (token) {
    try {
      var payload = await jwt.verify(token, process.env.SECRET);
      var user = await User.findById(payload.userId);
      req.user = user;
      return next();
    } catch (error) {
      res.status(401).json({ errors: { body: [error.toString()] } });
    }
  } else {
    res
      .status(401)
      .json({ errors: { body: ["token required for validation"] } });
  }
};
