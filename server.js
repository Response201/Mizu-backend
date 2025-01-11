const express = require('express');
const cors = require('cors');
const connectDatabase = require('./connectDatabase');
const cron = require('node-cron');
const { allProduct, updateRating, sortProducts, product } = require('./controllers/products');
const { authUser } = require('./middwares/auth');
const { createUser, signIn, signOut } = require('./controllers/user');
const { totalPrice, cart, payment, getCart, paymentComplete } = require('./controllers/cart');
const { getReceipts } = require('./controllers/receipts');
const { cleanUpExpiredTokens } = require('./cronJobs/cleanUpExpiredTokens');
const { cleanUpExpiredCarts } = require('./cronJobs/cleanUpExpiredCarts');

const app = express();


/* Connect to database */
connectDatabase();

/* setup - cors and json */
app.use(cors('*'));
app.use(express.json());

// Schedule a weekly cron job to clean up expired tokens every Monday at 03:00
cron.schedule('0 3 * * 1', cleanUpExpiredTokens);

// Schedule a daily cron job to clean up expired carts at 00:00
cron.schedule('0 0 * * *', cleanUpExpiredCarts);

const port = process.env.PORT || 3000; // Set the server's port from environment or default to 3000





/* Endpoints */


/* Start */
app.get("/", (req, res) => {
    res.send("Welcome to this API");
});


/* Products */

/* Get all products */
app.get("/allProducts", allProduct);

/* Get one product */
app.get("/product", product);

/* Sort products */
app.get("/sortProducts", sortProducts);

/* Update product rating */
app.put("/updateRating", authUser, updateRating);





/* User */

/* Sign out user */
app.post("/signout", signOut);

/* Sign in user */
app.post("/signin", signIn);

/* Create user */
app.post("/createUser", createUser);

/* Auth user */
app.post("/checkLoginStatus", authUser)





/* Cart */

/* Create a payment */
app.post("/create-payment-intent", authUser, payment)

/* Finalizes a payment */
app.post("/paymentComplete", authUser, paymentComplete)

/* Get total price + discount */
app.post("/totalPrice", totalPrice);

/* Get user cart */
app.post("/getcart", authUser, getCart)

/* Update cart - add, retrieve, or delete products based on user action */
app.post("/cart", authUser, cart);




/* Receipts */

/* Get user receipts */
app.post("/getReceipts", authUser, getReceipts)


/* Start server */
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
