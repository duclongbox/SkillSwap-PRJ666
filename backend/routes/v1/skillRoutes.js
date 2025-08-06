//routes/skillRoutes.js


const express = require("express");
const router = express.Router();
const { Skill } = require("../DBModels");
const { isAuthenticated } = require("../middlewares/auth"); // Adjust path as needed

// GET /api/skills - list all skills (populated with owner info)
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find({}).populate("owner_id", "name email");
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/skills/search?query=design&owner=owner_id
router.get("/search", async (req, res) => {
  try {
    const { query, owner } = req.query;
    const filter = {};

    if (query) {
      filter.title = { $regex: query, $options: "i" }; // Case-insensitive search
    }

    if (owner) {
      filter.owner_id = owner;
    }

    const skills = await Skill.find(filter).populate("owner_id", "name email");
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error searching skills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// GET /api/skills/user/:userId - Get all skills created by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const skills = await Skill.find({ owner_id: userId }).populate("owner_id", "name email");
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching user's skills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/skills/mine - fetch skills that belong to the logged-in user
router.get("/mine", isAuthenticated, async (req, res) => {
  console.log("HIT /api/skills/mine");
  console.log("Authenticated user:", req.user); // Log who is making the request

  try {
    const mySkills = await Skill.find({ owner_id: req.user._id }).populate("owner_id", "name email");
    res.status(200).json(mySkills);
  } catch (error) {
    console.error("Error in /api/skills/mine:", error); // Log the full error
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
