const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ItemDetails = require("./itemdetails-model");

// this will be our data base's data structure
var UserItemsSchema = new Schema(
  {
    items_image: String,
    item_name: String,
    item_price: Number,
    id: { type: Number, default: Date.now() }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);


// singular capitalized name for the mongo collection
module.exports = mongoose.model("useritems", UserItemsSchema);
