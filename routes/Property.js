const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Property = require("../models/Property");

console.log("Connected DB name:", mongoose.connection.name);

// GET /api/properties
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();
    console.log("Fetched properties count:", properties.length);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

module.exports = router;
