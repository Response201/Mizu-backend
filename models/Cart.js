const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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

});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;