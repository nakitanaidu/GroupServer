const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const UserItems = require("./useritems-model");
const Comment = require("./comments-model");

// When viewing itemdetails details we may need the writer and user comments
// so this model links to two other collectons

var ItemDetailsSchema = new Schema(
  {
    item_image: String,
    item_name: String,
    item_price: Number,
    item_size: Number,
    item_condition: String,
    item_description: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

// singular capitalized name for the mongo collection
// the collection in your database should be lowercase and plural
module.exports = mongoose.model("ItemDetails", ItemDetailsSchema);
