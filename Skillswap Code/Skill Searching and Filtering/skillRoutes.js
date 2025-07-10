//routes/skillRoutes.js


const express = require("express");
const router = express.Router();
const { Skill } = require("../DBModels");

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

module.exports = router;
