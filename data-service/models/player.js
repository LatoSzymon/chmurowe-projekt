const mongoose = require("mongoose");

const VALID_ROLES = ["top", "jungle", "mid", "bot", "support"];

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  role: { type: String, enum: VALID_ROLES, required: true },
  age: { type: Number },
  country: { type: String },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  avatar: {
    type: String
  }
});

module.exports = mongoose.model("Player", playerSchema);