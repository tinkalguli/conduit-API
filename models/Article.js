var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title : { type : String, required : true, unique : true },
    description : { type : String, minlength : 10 },
    author : { type : String , required : true }
}, { timestamps : true });

module.exports = mongoose.model("Article", articleSchema);