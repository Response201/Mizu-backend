const mongoose = require("mongoose");

// Define schema
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
       name:{
         type:String
       },
       price:{type:Number},
       quantity: {
         type: Number,
         default: 1,
       },
       pickAndMix: { type: Boolean, default: false },
     },
   ],
    totalPrice: { type: Number, required: true },
    discount: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now },
});
// Create a model from the schema for database operations
const Receipt = mongoose.model("Receipt", receiptSchema);
// Export the model to use it in other parts of the application
module.exports = Receipt;


