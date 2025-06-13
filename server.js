// Load core libraries ────────────────────────────────────────────────────────
const express = require("express"); // Web-framework for routing & middleware
const mongoose = require("mongoose"); // MongoDB ORM / ODM
const cors = require("cors"); // Enables Cross-Origin Resource Sharing
require("dotenv").config(); // Loads variables from .env into process.env

// Initialize Firebase Admin credentials (side-effect import)
require("./utils/firebaseAdmin"); // Verifies env vars & makes admin available

// ─────────────────────────────────────────────────────────────────────────────

// (Optional) security middleware
// const helmet    = require("helmet");    // Sets secure HTTP headers
// const rateLimit = require("express-rate-limit"); // Basic request-rate limiter

// Fail fast if the Mongo connection string is missing
if (!process.env.MONGO_URI) {
  console.error("❌  MONGO_URI missing in .env");
  process.exit(1); // Stop the server—can’t run without DB
}

// Create Express app instance
const app = express();

// Global middleware stack
app.use(
  cors({
    origin: [
      "http://localhost:5173", // dev
      "https://beta-house-frontend-pe4f.vercel.app", // your live frontend
    ],
    credentials: true,
  })
);

// Allow requests from any origin
app.use(express.json()); // Parse JSON request bodies
// app.use(helmet());                  // (uncomment to add security headers)
// app.use(rateLimit({                 // (uncomment to prevent brute-force)
//   windowMs: 10 * 60 * 1000,         //   10-minute window
//   max: 500                          //   500 requests per IP per window
// }));

// ─────────────────────────────────────────────────────────────────────────────
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) // Uses env var MONGO_URI
  .then(() => {
    console.log("✅ MongoDB connected");
    console.log("Connected DB name:", mongoose.connection.name); // Handy info
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

// ─────────────────────────────────────────────────────────────────────────────
// Route mounts
app.use("/api/auth", require("./routes/auth")); // Signup / login / reset
app.use("/api/protected", require("./routes/protected")); // Routes requiring auth
app.use("/api/properties", require("./routes/Property")); // CRUD for properties

// 404 handler (runs if no route matches)
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Generic error handler (catches thrown errors or next(err))
app.use((err, req, res, _next) => {
  console.error(err); // Log full stack trace
  res.status(500).json({ message: "Server error" });
});

// ─────────────────────────────────────────────────────────────────────────────
// Pick port from env (Render/Railway) or default to 5000 for local dev
const PORT = process.env.PORT || 5000;

// Start HTTP server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
