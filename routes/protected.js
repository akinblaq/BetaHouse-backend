// backend/routes/protected.js
const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");

router.get("/dashboard", auth, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}! This is protected content.`,
  });
});

module.exports = router;
