const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const Comment = require("./comments-model");

// When viewing itemdetails details we may need the writer and user comments
// so this model links to two other collectons

var ItemDetailsSchema = new Schema(
  {
    _id: Object,
    womens_category: String,
    mens_category: String,
    image: String,
    title: String,
    price: String,
    size: String,
    condition: String,
    description: String,

   
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

// singular capitalized name for the mongo collection
// the collection in your database should be lowercase and plural
module.exports = mongoose.model("ItemDetails", ItemDetailsSchema);
