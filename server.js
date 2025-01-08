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


/* connect to database */
connectDatabase();

/*  Middleware setup - cors and json */
app.use(cors('*'));
app.use(express.json());

// Skapa cron-jobb för att rensa gamla tokens varje vecka
cron.schedule('0 3 * * 1', cleanUpExpiredTokens);  // Körs varje måndag klockan 03:00

// Skapa cron-jobb för att rensa gamla varukorgar dagligen vid midnatt
cron.schedule('53 18 * * *', cleanUpExpiredCarts);  // Körs varje dag vid midnatt

const port = process.env.PORT || 3000;




/* Endpoints */


/* start */
app.get("/", (req, res) => {
    res.send("Welcome to this API");
});


/* Products */

/* get all products */
app.get("/allProducts", allProduct);


/* one product */
app.get("/product", product);

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

app.post("/checkLoginStatus", authUser)





/* Cart */

/* create payment intent  */

app.post("/create-payment-intent",authUser, payment)

app.post("/paymentComplete", authUser, paymentComplete)


/* add, remove, delete */
app.post("/cart", authUser, cart);



app.post("/getcart", authUser, getCart)


/* Get total price + discount */
app.post("/totalPrice",  totalPrice);
 


/* Receipts */
/* Get all receipts => user */
app.post("/getReceipts", authUser, getReceipts)



/* Start server */
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
