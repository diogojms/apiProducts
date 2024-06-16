"product strict";

//require
const mongoose = require("mongoose");
//schema
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    description: { type: String, required: true },
    img: {
      data: { type: Buffer },
      contentType: { type: String },
    },
  },
  { collection: "Products" }
);

// model
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
