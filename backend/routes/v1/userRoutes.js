//routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { User } = require("../DBModels");

// GET /api/users - Get all users (only name and _id, e.g., for dropdowns)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name _id");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/users/:id - Get a specific user profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email skills");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/users/:id - Update a user's profile
router.put("/:id", async (req, res) => {
  try {
    const { name, email, skills } = req.body;

    // Optional: validate email or skills format here

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, skills },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        skills: updatedUser.skills,
      }
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
