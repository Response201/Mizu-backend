const mongoose = require('mongoose');

// Define schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description:{ type: String, required: true },
  image: { type: String },
  primaryColor: { type: String },
  price: { type: Number, required: true },
  pickAndMix: { type: Boolean, default: false },
  stockLevel: {
    type: Number,
    required: true,
  },
  category: { type: String, required: true },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 }
    }
  ],
  averageRating:{type: Number, default:0}
});

// Create a model from the schema for database operations
const Products = mongoose.model('Products', productSchema);
// Export the model to use it in other parts of the application
module.exports = Products;
