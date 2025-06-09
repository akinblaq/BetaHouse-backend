// backend/routes/protected.js
const express = require("express");
const router = express.Router();
const admin = require("../utils/firebaseAdmin");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key"; // move to .env in production

router.get("/dashboard", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Try Firebase token verification first
    const decodedFirebase = await admin.auth().verifyIdToken(token);
    return res.json({
      message: `Welcome ${
        decodedFirebase.name || decodedFirebase.email || "user"
      }!`,
      authProvider: "Google",
      uid: decodedFirebase.uid,
    });
  } catch (firebaseError) {
    // If Firebase fails, try JWT verification
    try {
      const decodedJWT = jwt.verify(token, JWT_SECRET);
      return res.json({
        message: `Welcome ${decodedJWT.name || "user"}!`,
        authProvider: "Email/Password",
        userId: decodedJWT.id,
      });
    } catch (jwtError) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
});

module.exports = router;
