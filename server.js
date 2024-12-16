const express = require('express');
const cors = require('cors');
const connectDatabase = require('./connectDatabase');
const { allProduct, updateRating, sortProducts } = require('./controllers/products');
const { authUser } = require('./middwares/auth');
const { createUser, signIn, signOut } = require('./controllers/user');

const { cleanUpBlacklist } = require('./middwares/cleanBlackList');
const app = express();


/* connect to database */
connectDatabase();

/*  Middleware setup - cors and json */
app.use(cors('*'));
app.use(express.json());

/*clean up Blacklist from old tokens  */
app.use(cleanUpBlacklist);



const port = process.env.PORT || 3000;



/* Endpoints */


/* start */
app.get("/", (req, res) => {
    res.send("Welcome to this API");
});


/* Products */

/* get all products */
app.get("/allProducts", allProduct);


/* Update rating */

app.put("/updateRating", authUser, updateRating);

/* Sort products */

app.get("/sortProducts", sortProducts)




/* User */

/* create user */
app.post("/createUser", createUser);



/* sign in user */
app.post("/signin", signIn);


/* sign out user */
app.post("/signout", signOut);








/* Start server */
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
