var jwt = require("jsonwebtoken");

exports.generateJWT = async (user) => {
    var payload = { userId : user.id, email : user.email };
    var token = await jwt.sign(payload, process.env.SECRET);
    return token;
}

exports.verifyToken = async (req, res, next) => {
    console.log(req.headers);
    var token = req.headers.authorization;
    if (token) {
        try {
            var payload = await jwt.verify(token, process.env.SECRET);
            req.user = payload;
            next();
        } catch (error) {
            res.status(401).json({ error });
        }
    } else {
        res.status(401).json({ error : "token required for validation"});
    }
}