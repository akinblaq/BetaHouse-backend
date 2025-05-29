const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    location: String,
    price: String,
    description: String,
    bedrooms: Number,
    bathrooms: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
