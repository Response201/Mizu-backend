

const Receipt = require('../models/Receipts');
require('dotenv').config()







/* Get user receipts */
exports.getReceipts = async (req, res) => {

    const { userId } = req.body;
    const page = parseInt(req.query.page) - 1 || 0; // Get current page, default to 0
    const limit = parseInt(req.query.limit) || 10;  // Get records per page, default to 10

    try {

        const totalReceipts = await Receipt.countDocuments({ userId }); // Count total receipts 

        //  Fetch the list of receipts for `userId`, using pagination parameters (`skip` and `limit`)
        const receiptsList = await Receipt.find({ userId })
            .skip(page * limit) // Skip records based on the current page
            .limit(limit);      // Limit the number of records to fetch

        // If no receipts are found, return an empty response with pagination details 
        if (!receiptsList || receiptsList.length === 0) {
            return res.status(200).json({
                total: 0,          // Total receipts count
                totalPages: 0,    //  total pages
                page: page + 1,    // Current page number (adjusted to 1-based index)
                limit,             // Records per page
                receiptsList: [],   // Empty receipts list
            });
        }

        //  Return the fetched receipts along with pagination details.
        res.json({
            total: totalReceipts,               // Total receipts count
            totalPages: Math.ceil(totalReceipts / limit), // Calculate total pages
            page: page + 1,                     // Current page number (adjusted to 1-based index)
            limit,                              // Records per page
            receiptsList,                       // List of receipts
        });
    } catch (error) {
        // if error send  

        res.status(500).json({
            total: 0,          // Total receipts count
            totalPages: 0,    //  total pages 
            page: 1,        // Default to page 1
            limit,     // Records per page
            receiptsList: [], // Empty receipts list         
        });
    }
};