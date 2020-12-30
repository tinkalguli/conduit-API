var { Schema, model } = require("mongoose");
var bcrypt = require("bcrypt");

var userSchema = new Schema({
    username : { type : String, unique : true, required : true },
    email : { type : String, unique : true, required : true },
    password : { type : String, required : true },
    bio : String,
    image : String,
    followings : [{ type : Schema.Types.ObjectId, ref : "User" }]
}, { timestamps : true });

userSchema.pre("save", function(next) {
    if (this.password) {
        bcrypt.hash(this.password, 12, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = model("User", userSchema);