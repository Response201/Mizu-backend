const jwt = require("jsonwebtoken");
const User = require("../models/Users");
require('dotenv').config();
const bcrypt = require("bcrypt");
const Blacklist = require("../models/Blacklist")







/* sign out */
exports.signOut = async (req, res) => {
    const token = req.header("Authorization").slice(7);


    /*   Sätt en utgångstid för tokenen*/

    const expiresAt = new Date();

    /* Lägg till 2 minuter till expiresAt för att hantera eventuella fel som kan uppstå. */

    expiresAt.setMinutes(expiresAt.getMinutes() + 2);

    /*  Skapa en ny post i blacklisten med tokenen och dess utgångstid. */
    const blacklistToken = new Blacklist({
        token,
        expiresAt
    });

    try {
        await blacklistToken.save();
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging out" });
    }

};



/* sign in */
exports.signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        /* Hitta användaren i databasen */
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const id = user._id;
        /*  Kontrollera om användaren är registrerad med google */
        if (user.provider !== "default") {
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            return res.status(200).json({ message: "Login with google", token, "userId": id });
        }

        if (!password) {

            return res.status(404).json({ message: "No password" });

        }



        /*  Verifiera lösenordet */
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Skapa JWT-token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.TOKEN_SECRET, // Hemlig nyckel
            { expiresIn: '1h' } // Håller en timme (1 timme)
        );


        /* Om allt stämmer, returnera framgångsmeddelande */
        res.json({ message: "Login successful!", "token": token, "userId": id });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }

};



/* create user */

exports.createUser = async (req, res) => {

    const { email, password, provider } = req.body;

    try {
        // Kontrollera om användaren redan finns
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Something went wrong!" });
        }

        // Kryptera lösenordet om det är en standardregistrering
        let hashedPassword = null;
        if (provider === "default" && password) {
            hashedPassword = await bcrypt.hash(password, 12);
        }

        // Skapa en ny användare
        const newUser = new User({
            email,
            password: hashedPassword,
            provider,
        });

        // Spara användaren
        await newUser.save();

        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).json({ message: "Server error!" });
    }

};