const mongoose = require("mongoose");

const Product = require('../models/Product');



/* get all Products */
exports.allProduct = async (req, res) => {
    try {

        const allProducts = await Product.find();

        /* if no products are found, respond with a 404 error */
        if (!allProducts) {
            return res.status(404).json({ message: "No Products found" });
        } else {
            /*  respond with the list of all products */
            res.json({ products: allProducts });
        }
    } catch (error) {

        res.json({ error: 'Something went wrong' });
    }
};
