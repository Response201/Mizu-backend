const jwt = require("jsonwebtoken");
require("dotenv").config();
const Blacklist = require("../models/Blacklist");
exports.authUser = async (req, res, next) => {
  try {
    let tmp = req.header("Authorization");

    /* tar ut så endast token blir kvar  */
    const token = tmp ? tmp.slice(7, tmp.length) : "";

    if (!token) {
      return res.status(403).json({ message: "Invalid Authorization. Please log in" });
    }

    const blacklistToken = await Blacklist.findOne({ token });

    if (blacklistToken) {
      /* Om tokenen finns i blacklisten, skicka felmeddelande */
      return res.status(403).json({ message: "Invalid Authorization. Please log in" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid Authorization. Please log in" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

