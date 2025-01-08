const mongoose = require('mongoose');

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
        unique: true
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

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;