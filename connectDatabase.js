const mongoose = require('mongoose');
const seedProducts = require('./functions/seedProducts');
require('dotenv').config();

/* MongoDB connection URL, defaults to local if not specified */
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/Mizu";

/* Function to connect to MongoDB */
function connectDatabase() {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log("Connected to MongoDB!!!"); // Log successful connection
            seedProducts()  // Seed initial products into the database
        })
        .catch(err => {
            console.error("MongoDB connection error:", err); // Log any connection errors
        });
}


module.exports = connectDatabase;