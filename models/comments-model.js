const mongoose = require("mongoose");
const Comment = require("./itemdetails-model");
var Schema = mongoose.Schema;

var CommentsSchema = new Schema(
  {
    comment: String,
  },
  {
    timestamps: true
  }
);

// singular capitalized name for the mongo collection
module.exports = mongoose.model("Comment", CommentsSchema);
