const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String },
  imageUrl: { type: String },
  price: { type: String },
  color: { type: String },
  description: { type: String },
});

module.exports = model("Product", schema);
