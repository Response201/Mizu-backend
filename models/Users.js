const mongoose = require("mongoose");


// Definiera användarschemat
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);
module.exports = User;


