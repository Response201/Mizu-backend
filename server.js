const express = require('express');
const cors = require('cors');
const connectDatabase = require('./connectDatabase');
const { allProduct, updateRating, sortProducts } = require('./controllers/products');
const { authUser } = require('./middwares/auth');
const { createUser, signIn, signOut } = require('./controllers/user');
const { cleanUpBlacklist } = require('./middwares/cleanBlackList');
const { totalPrice, cart, payment, getCart, paymentComplete } = require('./controllers/cart');
const { getReceipts } = require('./controllers/receipts');
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
