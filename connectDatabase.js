const mongoose = require('mongoose');

/* MongoDB connection URL, defaults to local if not specified */
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/Mizu";

/* Function to connect to MongoDB */
function connectDatabase() {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log("Connected to MongoDB!!!");

        })
        .catch(err => {
            console.error("MongoDB connection error:", err);
        });
}


module.exports = connectDatabase;