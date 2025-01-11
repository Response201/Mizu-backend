const mongoose = require("mongoose");


// Define schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a model from the schema for database operations
const User = mongoose.model("User", userSchema);
// Export the model to use it in other parts of the application
module.exports = User;


