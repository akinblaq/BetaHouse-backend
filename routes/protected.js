const express = require("express");
const router = express.Router();
const admin = require("../utils/firebaseAdmin");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // ✅ use env

router.get("/dashboard", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Try Firebase (Google sign-in) token first
    const decodedFirebase = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ email: decodedFirebase.email });
    return res.json({
      message: `Welcome back, ${user?.name || "Google user"}!`,
      user,
      authProvider: "Google",
    });
  } catch (firebaseError) {
    // Fallback to standard JWT token
    try {
      const decodedJWT = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decodedJWT.id);
      return res.json({
        message: `Welcome back, ${user?.name || "user"}!`,
        user,
        authProvider: "Email/Password",
      });
    } catch (jwtError) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
});

module.exports = router;
