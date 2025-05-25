const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: Boolean,
  skills: [String],
});

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
});

const skillSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", userSchema, "users");
const Admin = mongoose.model("Admin", adminSchema, "admins");
const Skill = mongoose.model("Skill", skillSchema, "skills");

module.exports = {
  User,
  Admin,
  Skill,
};
