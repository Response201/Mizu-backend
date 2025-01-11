const mongoose = require('mongoose');

// Define schema
const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});
// Create a model from the schema for database operations
const Blacklist = mongoose.model('Blacklist', blacklistSchema);
// Export the model to use it in other parts of the application
module.exports = Blacklist;