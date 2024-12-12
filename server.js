const express = require('express');
const cors = require('cors');
const connectDatabase = require('./connectDatabase');
const { allProduct } = require('./controllers/products');
const app = express();


/* connect to database */
connectDatabase();

/*  Middleware setup - cors and json */
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;



/* Endpoints */


/* start */
app.get("/", (req, res) => {
    res.send("Welcome to this API");
});


/* Products */

/* get all products */
app.get("/allProducts", allProduct);




/* Start server */
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
