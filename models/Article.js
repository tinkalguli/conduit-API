var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var slug = require("mongoose-slug-updater");
var options = {
  separator: "_",
  lang: "en",
  truncate: 50,
  backwardCompatible: true, //support for the old options names used in the mongoose-slug-generator
};
mongoose.plugin(slug, options);

var articleSchema = new Schema(
  {
    slug: {
      type: String,
      unique: true,
      slug: "title",
      slugPaddingSize: 4,
    },
    title: { type: String, required: true },
    description: { type: String, minlength: 10 },
    body: { type: String, minlength: 20 },
    tagList: [{ type: String }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
