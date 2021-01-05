var { Schema, model } = require("mongoose");

var commentSchema = new Schema({
    body : { type : String },
    author : { type : Schema.Types.ObjectId , ref : "User", required : true }
}, { timestamps : true });

module.exports = model("Comment", commentSchema);