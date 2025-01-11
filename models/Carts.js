const mongoose = require('mongoose');
// Define schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
     
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
  expiresAt: {
    type: Date, 
    default: () => new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), //  expireDate 24 timmar framåt 
  },
});

// Create a model from the schema for database operations
const Carts = mongoose.model('Carts', cartSchema);
// Export the model to use it in other parts of the application
module.exports = Carts;