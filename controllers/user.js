const jwt = require("jsonwebtoken");
const User = require("../models/Users");
require('dotenv').config();
const bcrypt = require("bcrypt");
const Blacklist = require("../models/Blacklist")







/* Sign out */
exports.signOut = async (req, res) => {
    // Extract the token from the Authorization header (remove 'Bearer ' prefix)
    const token = req.header("Authorization").slice(7);


    // Set the token expiration time 
    const expiresAt = new Date();

    // Add 1 hour to the expiration time to handle any potential delays.
    // This ensures the token is invalidated after more than 1 hour.
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Create a new entry in the blacklist with the token and its expiration time
    const blacklistToken = new Blacklist({
        token,
        expiresAt
    });

    try {
        // Save the blacklist entry to invalidate the token
        await blacklistToken.save();
        // Respond with a success message
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        // Handle and return errors
        res.status(500).json({ message: "Error logging out" });
    }

};



/* Sign in */
exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    // Convert email to lowercase to standardize the search
    const username = email.toLowerCase();

    try {
        // Find the user in the database using the provided email
        const user = await User.findOne({ email: username });

        if (!user) {
            // If the user does not exist, return an error
            return res.status(404).json({ message: "User not found" });
        }

        const id = user._id;; // Extract the user's id for sending in the response


        // Check if the user is registered through Google (OAuth)
        if (user.provider !== "default") {
            // If the user logged in with Google, create a JWT token 
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            // then return success response with token and userId
            return res.status(200).json({ message: "Login with google", token, "userId": id });
        }

        if (!password) {
            // If no password is provided, return an error
            return res.status(404).json({ message: "No password" });

        }



        // Verify the provided password against the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            // If the password is incorrect, return an error
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Create a JWT token if credentials are valid
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.TOKEN_SECRET, // Secret key to sign the token
            { expiresIn: '1h' } // Token expiration time (1 hour)
        );


        // If everything is correct, return success response with token and userId
        res.json({ message: "Login successful!", "token": token, "userId": id });
    } catch (error) {
        // Handle and return errors
        res.status(500).json({ message: "Something went wrong" });
    }

};



/* Create user */

exports.createUser = async (req, res) => {
    const { email, password, provider } = req.body;

    // Normalize email to lowercase to standardize the input
    const username = email.toLowerCase();


    try {
        // Check if the user already exists with the provided email
        const existingUser = await User.findOne({ email: username });

        if (existingUser) {
            // If user exists, return an error message
            return res.status(400).json({ message: "Something went wrong!" });
        }

        // Encrypt the password if it's a default registration 
        let hashedPassword = null;
        if (provider === "default" && password) {
            hashedPassword = await bcrypt.hash(password, 12); // Hash the password with bcrypt
        }

        // Create a new user 
        const newUser = new User({
            email: username,
            password: hashedPassword,
            provider,
        });

        // Save the new user to the database
        await newUser.save();
        // Return success response
        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        // Handle and return errors
        res.status(500).json({ message: "Something went wrong" });
    }

};