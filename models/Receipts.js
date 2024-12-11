const mongoose = require("mongoose");


// Definiera kvittoschemat
const receiptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    totalPrice: { type: Number, required: true },
    discount: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now },
});
const Receipt = mongoose.model("Receipt", receiptSchema);
module.exports = Receipt;


