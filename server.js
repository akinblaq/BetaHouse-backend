const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    console.log("Connected DB name:", mongoose.connection.name); // ✅ should now work
  })
  .catch((err) => console.log("❌ MongoDB error:", err));

app.use("/api/auth", require("./routes/auth"));

app.use("/api/protected", require("./routes/protected"));

const propertyRoutes = require("./routes/Property");
app.use("/api/properties", propertyRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
