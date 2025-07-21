const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: Boolean,
  skills: [String],
  profilePicture: String, // Base64 encoded image or URL
  connections:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Connection" }],
});

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
});

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exchangeSkills: [String],
  description: { type: String, required: true },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
  availability: { type: String, enum: ['Flexible', 'Weekdays', 'Weekends', 'Evenings'], default: 'Flexible' },
  duration: { type: String, enum: ['30 minutes', '1-2 hours', '2-4 hours', 'Half day', 'Full day', 'Multiple sessions'], default: '1-2 hours' },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const connectionSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createAt: Date,
    updatedAt: Date,
    status: String
  },{timestamps:true});

const User = mongoose.model("User", userSchema, "users");
const Admin = mongoose.model("Admin", adminSchema, "admins");
const Skill = mongoose.model("Skill", skillSchema, "skills");
const Connection = mongoose.model("Connection",connectionSchema)

module.exports = {
  User,
  Admin,
  Skill,
  Connection
};
