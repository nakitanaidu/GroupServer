const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentsSchema = new Schema(
  {
    comment: String,

    //  " added by cruz - must use when creating new user items to link to commenting"
    id: String,
  },
  {
    timestamps: true,
  }
);

// singular capitalized name for the mongo collection
module.exports = mongoose.model("Comment", CommentsSchema);
