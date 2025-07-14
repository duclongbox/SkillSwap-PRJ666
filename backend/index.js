//index.js
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// DB connection
require("./DBConnect");

// Middleware
app.use(express.json());

// Serve static files from 'public' folder
app.use(express.static("public"));

// Routes
const skillRoutes = require("./routes/skillRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/skills", skillRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("SkillSwap API running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
