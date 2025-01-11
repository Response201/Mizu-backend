const mongoose = require("mongoose");

const Product = require('../models/Products');



/* Get all products */
exports.allProduct = async (req, res) => {
    try {
        // Fetch all products from the database
        const allProducts = await Product.find();


        if (!allProducts) {
            //If no products are found, send a 404 error response
            return res.status(404).json({ message: "No Products found" });
        } else {
            // If products are found, send them back in the response 
            res.json({ products: allProducts });
        }
    } catch (error) {
        // Handle and return errors
        res.json({ error: 'Something went wrong' });
    }
};





/* Get one product */
exports.product = async (req, res) => {
    try {
        // Get the productId from the query parameters
        const productId = req.query.id;
        // Find the product in the database using the productId
        const product = await Product.findOne({ _id: productId });


        if (!product) {
            // If no product is found, send a 404 error response 
            return res.status(404).json({ message: "No Products found" });
        } else {
            //  If the product is found, send it back in the response
            res.json({ product: product });
        }
    } catch (error) {
        // Handle and return errors
        res.json({ error: 'Something went wrong' });
    }
};





/* Sort products */
exports.sortProducts = async (req, res) => {
    try {
        // Fetch unique product categories from the database
        const uniqueCategories = await Product.distinct("category");

        // Retrieve query parameters, applying default values if not provided
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 6;
        const search = req.query.search || "";
        const sort = req.query.sort || "averageRating, price";
        const category = req.query.category || "all";
        const pickAndMix = req.query.pickAndMix === "true" || false;

        // If category is 'all', take all unique categories, otherwise filter by selected categories 
        const categoriesToFilter = category === "all" ? uniqueCategories : req.query.category.split(",");

        // Create sorting array from the query parameter 'sort'
        const sortArray = req.query.sort ? req.query.sort.split(",") : [sort];

        /* Create sort object for MongoDB, (e.g., {price: 1 for ascending, rating: -1 for descending} */
        let sortCriteria = {};
        // Loop through the sorting fields and construct the MongoDB sort object
        sortArray.forEach(field => {
            const [key, order] = field.split(":");
            // Sort by price or averageRating, defaulting to ascending if no order specified
            if (key === "price" || key === "averageRating") {
                sortCriteria[key] = order === "desc" ? -1 : 1;
            }
        });

        //  If no sorting criteria for price, set it to descending order (-1)
        if (!sortCriteria.price) {
            sortCriteria.price = -1;
        }
        // If no sorting criteria for averageRating, set it to descending order (-1)
        if (!sortCriteria.averageRating) {
            sortCriteria.averageRating = -1;
        }

        // If neither price nor averageRating is specified, set both to descending order
        if (!sortCriteria.price && !sortCriteria.averageRating) {
            sortCriteria = { price: -1, averageRating: -1 };
        }

        // Build the match criteria for the aggregation query
        const matchCriteria = {
            name: { $regex: search, $options: "i" }, // Search case-insensitive by product name -  regardless of whether the letters are uppercase or lowercase 
            category: { $in: categoriesToFilter },   // Filter products by selected categories (either specific categories or all)
            stockLevel: { $gte: 1 } // Filter out products that have a stock level less than 1
        };

        // Add the pickAndMix filter if it is set to true
        if (pickAndMix) {
            matchCriteria.pickAndMix = true;
        }

        // Create MongoDB aggregation pipeline
        const aggregationPipeline = [

            {
                $match: matchCriteria    // Match products based on search, category, and stock level
            },
            {
                $sort: sortCriteria  // Apply sorting based on price and rating
            },
            {
                $skip: page * limit   // Skip the products based on the page number for pagination
            },
            {
                $limit: limit // Limit the number of products per page
            }
        ];
        // Execute the aggregation pipeline to get sorted and paginated products
        const getSearch = await Product.aggregate(aggregationPipeline);

        //  Count the total number of products that match the search and filters for pagination
        const total = await Product.countDocuments({
            name: { $regex: search, $options: "i" }, // Search case-insensitive by product name -  regardless of whether the letters are uppercase or lowercase 
            category: { $in: categoriesToFilter },  // Filter products by selected categories (either specific categories or all)
            stockLevel: { $gte: 1 }, // Filter out products that have a stock level less than 1
            ...(pickAndMix ? { pickAndMix: true } : {})  // Conditionally add pickAndMix filter
        });

        // Create a response object containing pagination details and filtered product
        const response = {
            total, // Total number of matching products
            page: page + 1, // Current page number (1-indexed for user-friendly display)
            limit,  // Number of products per page
            products: getSearch,  // List of products based on the search and filter criteria
            categories: uniqueCategories  // List of available categories 
        };
        // Return the response with sorted and paginated products
        res.status(200).json(response);
    } catch (error) {
        // Handle and return errors
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};







/* Update product rating */
exports.updateRating = async (req, res) => {
    const { id, userId, newRating } = req.body;

    // Check if all required fields are provided
    if (!id || !userId || newRating == null) {
        return res.status(400).json({
            message: "Product ID, User ID, and Rating are required",
        });
    }
    // Validate the provided ids
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid Product ID or User ID" });
    }


    try {
        // Find the product by its id
        const product = await Product.findById(id);

        // If product not found, return an error
        if (!product) {

            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user has already rated the product
        const existingRatingIndex = product.ratings.findIndex(
            (rating) => rating.userId.toString() === userId
        );

        if (existingRatingIndex >= 0) {
            // Update existing rating if user already rated
            product.ratings[existingRatingIndex].rating = newRating;
        } else {
            // If the user hasn't rated the product before, add a new rating
            product.ratings.push({ userId, rating: newRating });
        }


        // Function to calculate the average rating of a product 
        const newAverageRating = (ratings) => {
            if (ratings.length === 0) return 0;  // Return 0 if no ratings exist
            const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);  // Calculate the total sum of all ratings and then divide by the number of ratings to get the average
            return totalRating / ratings.length;  // Return the calculated average rating
        };

        // Update product's average rating
        const averageRating = newAverageRating(product.ratings);
        product.averageRating = averageRating;

        // Save the updated product with the new rating and average rating
        await product.save();

        // Return success message with the updated product
        res.json({
            message: "Rating updated successfully",
            product: product,
        });
    } catch (error) {
        // Handle and return errors
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};