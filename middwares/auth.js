const jwt = require("jsonwebtoken");
require("dotenv").config();
const Blacklist = require("../models/Blacklist");


/* Authenticate user */
exports.authUser = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header  
    let tmp = req.header("Authorization");

   //  Extract the token by removing the "Bearer " prefix, if present 
    const token = tmp ? tmp.slice(7, tmp.length) : "";

    if (!token) {
      //Respond with an error if no token is provided
      return res.status(403).json({ message: "Invalid Authorization. Please log in" });
    }

    // Check if the token is in the blacklist (indicating it is invalid) 
    const blacklistToken = await Blacklist.findOne({ token });

    if (blacklistToken) {
      //  If the token is blacklisted, deny access 
      return res.status(403).json({ message: "Invalid Authorization. Please log in" });
    }

    // verify the token's validity and decode the user information
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        // Respond with an error if the token is invalid or expired
        return res.status(403).json({ message: "Invalid Authorization. Please log in" });
      }

      // attach the decoded user information to the request object
      req.user = user;
      // Proceed to controller(e.g getCart, app.post("/getcart", authUser, getCart) )
      next();
    });
  } catch (error) {
      // Handle and return errors
    res.status(500).json({ message: error.message });
  }
};

