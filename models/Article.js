var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    slug : { type : String, unique : true, required : true },
    title : { type : String, required : true, unique : true },
    description : { type : String, minlength : 10 },
    body : { type : String, minlength : 20 },
    tagList : [{ type : String }],
    favorites : [{ type : Schema.Types.ObjectId, ref : "User" }],
    comments : [{ type : Schema.Types.ObjectId, ref : "Comment" }],
    author : { type : Schema.Types.ObjectId, required : true, ref : "User" }
}, { timestamps : true });

module.exports = mongoose.model("Article", articleSchema);