// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const admin = require("../utils/firebaseAdmin"); // adjust path as needed

// Secret key for JWT
const JWT_SECRET = "your_secret_key"; // move to env in production

// Register
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ user: { id: user._id, name, email }, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ user: { id: user._id, name: user.name, email }, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// routes/auth.js
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // TODO: Generate token, send email with reset link
    res.status(200).json({ message: "Password reset instructions sent" });
  } catch (err) {
    res.status(500).json({ message: "Error sending reset instructions" });
  }
});

// Google Authentication Route
router.post("/google-auth", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ email });

    // If not, create new user (optional password fallback using UID)
    if (!user) {
      user = await User.create({
        name,
        email,
        password: uid, // or a generated string (just not used manually)
        googleId: uid,
      });
    }

    // Generate your own JWT for session handling
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your_secret_key",
      {
        expiresIn: "1h",
      }
    );

    res.json({ token: jwtToken, user: { id: user._id, name, email } });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid Google token", error });
  }
});

module.exports = router;
