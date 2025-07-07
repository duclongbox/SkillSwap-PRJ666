const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  verified: Boolean,
  skills: [String],
  connections:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Connection" }],
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
