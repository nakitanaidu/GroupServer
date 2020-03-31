const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ItemDetails = require("./itemdetails-model");

// this will be our data base's data structure
var UserItemsSchema = new Schema(
  {
    _id: Object,
    womens_category: String,
    mens_category: String,
    image: String,
    title: String,
    price: String,
    
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);


// singular capitalized name for the mongo collection
module.exports = mongoose.model("useritems", UserItemsSchema);
