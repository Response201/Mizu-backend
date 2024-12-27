const mongoose = require("mongoose");

const Product = require('../models/Product');



/* get all Products */
exports.allProduct = async (req, res) => {
    try {

        const allProducts = await Product.find();

        /* om inga produkter finns skickas status 404 error */
        if (!allProducts) {
            return res.status(404).json({ message: "No Products found" });
        } else {
            /*  om produkter hittas skickas de */
            res.json({ products: allProducts });
        }
    } catch (error) {

        res.json({ error: 'Something went wrong' });
    }
};




/* Sort products */
exports.sortProducts = async (req, res) => {
    try {
        // Hämta unika kategorier från produkter
        const uniqueCategories = await Product.distinct("category");

        // Hämta query-parametrar från request
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 6;
        const search = req.query.search || "";
        const sort = req.query.sort || "averageRating";
        const category = req.query.category || "all";

        /* Om kategori är 'all', ta alla unika kategorier, annars filtrera på de valda */
        const categoriesToFilter = category === "all" ? uniqueCategories : req.query.category.split(",");

        /* Skapa sorteringsobjekt från query-parametern 'sort' */
        const sortArray = req.query.sort ? req.query.sort.split(",") : [sort];


        /*  Skapa sorteringsobjekt för MongoDB, 
    (tex: {price: 1, Stigande sortering (asc), rating: -1 Fallande sortering (desc)   }) */
        let sortCriteria = {};

        sortArray.forEach(field => {
            const [key, order] = field.split(":");
            // Sort by price or averageRating, defaulting to ascending if no order specified
            if (key === "price" || key === "averageRating") {
                sortCriteria[key] = order === "desc" ? -1 : 1;
            }
        });


        if (!sortCriteria.price && !sortCriteria.averageRating) {
            sortCriteria.averageRating = 1;
        }

        /* Skapa sorteringsobjekt för MongoDB */
        const aggregationPipeline = [
            /*   Matcha produkter med sökning och kategori */
            {
                $match: {
                    name: { $regex: search, $options: "i" },
                    category: { $in: categoriesToFilter }
                }
            },
            {
                $sort: sortCriteria  // Sortera baserat på sorteringskriterier (pris, betyg)
            },
            {
                $skip: page * limit   
            },
            {
                $limit: limit // Limit => antal produkter
            }
        ];

        /*  Kör aggregation för att få sorterade produkter */
        const getSearch = await Product.aggregate(aggregationPipeline);

        /* Räkna det totala antalet produkter som matchar sökning och filtrering för paginering */
        const total = await Product.countDocuments({
            category: { $in: categoriesToFilter },
            name: { $regex: search, $options: "i" }
        });

        /* Skapa ett svar med total antal produkter, nuvarande sida, limit och resultat */
        const response = {
            total,
            page: page + 1,
            limit,
            products: getSearch,
            categories: uniqueCategories
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};





/* Update rating */
exports.updateRating = async (req, res) => {
    const { id, userId, newRating } = req.body;

    if (!id || !userId || newRating == null) {
        return res.status(400).json({
            message: "Product ID, User ID, and Rating are required",
        });
    }
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid Product ID or User ID" });
    }


    try {
        /* Hitta produkten baserat på dess ID */
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        /* Kontrollera om användaren redan har ett betyg */
        const existingRatingIndex = product.ratings.findIndex(
            (rating) => rating.userId.toString() === userId
        );

        if (existingRatingIndex >= 0) {
            /* Uppdatera användarens befintliga betyg */
            product.ratings[existingRatingIndex].rating = newRating;
        } else {
            /*  Lägg till ett nytt betyg för användaren */
            product.ratings.push({ userId, rating: newRating });
        }


        /* Funktion för att beräkna medelbetyget */
        const newAverageRating = (ratings) => {
            if (ratings.length === 0) return 0;  // Om inga betyg finns, returnera 0
            const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
            return totalRating / ratings.length;
        };

        /* Uppdatera produktens genomsnittliga betyg med det nya värdet */
        const averageRating = newAverageRating(product.ratings);
        product.averageRating = averageRating;

        /* Spara den uppdaterade produkten */
        await product.save();

        res.json({
            message: "Rating updated successfully",
            product: product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};