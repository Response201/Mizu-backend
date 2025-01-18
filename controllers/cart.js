
const mongoose = require("mongoose");
const Product = require('../models/Products');
const Cart = require('../models/Carts');
const Receipt = require('../models/Receipts');
require('dotenv').config()
const stripe = require("stripe")(process.env.KEY);





/* Function to calculate the order amount in cents */
const calculateOrderAmount = (totalPrice) => {
  const getAmount = Math.round(totalPrice * 100);
  return getAmount;
};







/*  Create a payment */
exports.payment = async (req, res) => {
  const { totalPrice } = req.body;

  try {
    // Creates a payment intent with Stripe - await ensures calculateOrderAmount completes before proceeding
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(totalPrice),
      currency: "sek",
      automatic_payment_methods: { enabled: true },
    });



    // Returns clientSecret 
    res.send({ clientSecret: paymentIntent.client_secret });

  } catch (error) {

    // Handle and return errors
    res.status(500).send({ error: 'Payment failed', details: error.message });
  }
};







/* Finalizes a payment */
exports.paymentComplete = async (req, res) => {
  const { totalPrice, discount, userId, cart } = req.body;

  // Validate user id and cart
  if (!userId || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).send({ error: 'Invalid cart or user ID' });
  }

  try {

    // Creates a receipt by mapping the user's cart items and assigning userId, totalPrice and discount values
    const receipt = new Receipt({
      userId: new mongoose.Types.ObjectId(userId),
      products: cart.map(item => ({
        productId: new mongoose.Types.ObjectId(item.productId),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        pickAndMix: item.pickAndMix,
      })),
      totalPrice: totalPrice,
      discount: discount,
    });

    // save the receipt to the database
    await receipt.save();

    // Clear the cart after purchase
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { products: [] },
      { new: true }
    );

    // Save the updated cart
    await updatedCart.save();


    // Return the receipt
    res.send({ receipt });
  } catch (error) {
    // Handle and return errors
    res.status(500).send({ error: 'Payment failed', details: error.message });
  }
};









/* 
  Calculates the total price for a user's cart, including a 10% discount for each 
  "pick and mix" group (serum, face cream, face mask) that is fulfilled.
*/
exports.totalPrice = async (req, res) => {
  try {
    const { userId } = req.body;

    // Retrieve the user's cart from the database 
    const cart = await Cart.findOne({ userId });

    //If no cart is found, return an error
    if (!cart) {
      return res.status(404).json({ error: 'no cart is found' });
    }

    // Arrays used to create pick and mix groups -> ensures that the conditions for the 10% discount are met. 
    let serums = [];
    let faceCreams = [];
    let faceMasks = [];
    let totalPrice = 0;

    /* 
      Loop through all products in the user's cart. For each product, fetch its details and add the price (multiplied by quantity) 
      to the totalprice. Additionally, add eligible products to their respective "pick and mix" arrays if they meet the criteria.
    */
    for (let product of cart.products) {

      // Fetch product by id
      const item = await Product.findById(product.productId);

      if (item) {

        // Add the product's price multiplied by quantity to the total price
        totalPrice += item.price * product.quantity;


        // Check product's category and "pick and mix" boolean value -> add to correct array if the product meets criteria 
        if (item.category === "serum" && item.pickAndMix) {
          for (let i = 0; i < product.quantity; i++) {
            serums.push(item); // Add to serums array
          }
        } else if (item.category === "face cream" && item.pickAndMix) {
          for (let i = 0; i < product.quantity; i++) {
            faceCreams.push(item); // Add to faceCreams array
          }
        } else if (item.category === "face mask" && item.pickAndMix) {
          for (let i = 0; i < product.quantity; i++) {
            faceMasks.push(item); // Add to faceMasks array
          }
        }
      }
    }



    // Group products into sets of three: one serum, one face cream, and one face mask
    let groups = [];



    // Find the smallest length among the three arrays (serums, face creams, and face masks)
    // This ensures the loop only runs as many times as there are complete sets of products
    let minLength = Math.min(serums.length, faceCreams.length, faceMasks.length);


    // Loop through the arrays, creating a group for each complete set of products
    for (let i = 0; i < minLength; i++) {

      // Create a new group object containing one product from each array.
      // The index 'i' is used to take the correct product from each array.
      groups.push({
        serum: serums[i],
        faceCream: faceCreams[i],
        faceMask: faceMasks[i]
      });
    }


    //  Calculate the discount for each group 
    let discount = 0;

    for (let group of groups) {

      // Calculate the total price of the group
      const groupPrice = group.serum.price + group.faceCream.price + group.faceMask.price;

      /* 
        Multiply groupPrice by 0.10 to calculate 10% of the price for each group.
        Then multiply by 100 and divide by 100 to round to two decimal places (e.g., 10.100 becomes 10.00).
        Math.round() ensures the value is rounded to the nearest hundredth (e.g., 10.145 becomes 10.15, and 10.144 becomes 10.14).
      
        Add the calculated discount value to the total discount.
      */
      discount += Math.round(groupPrice * 0.10 * 100) / 100;
    }

    // Subtract the discount amount from the total price. totalPrice represents the sum of the prices of all products in the user's cart.
    totalPrice -= discount;

    // Return the totalprice and discounts 
    res.json({ "totalprice": totalPrice, "discount": discount });
  } catch (error) {
    // Handle and return errors
    res.status(500).json({ error: 'Something went wrong' });
  }
};







/*  Find or create a cart */
const findOrCreateCart = async (userId) => {

  // Try to find an existing cart for the userId
  let cart = await Cart.findOne({ userId });

  // If no cart exists, create a new one
  if (!cart) {

    cart = new Cart({
      userId,
      products: [], // Initialize with an empty products array
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // Set expiration to 24 hours from now
    });

    // Save the new cart
    await cart.save();
  }

  // Return the cart
  return cart;
};





/* Get user cart */
exports.getCart = async (req, res) => {
  const { userId } = req.body;

  try {
    // findOrCreateCart function finds or creates a cart 
    const cart = await findOrCreateCart(userId);
    // Return the cart
    res.json({ cart });
  } catch (error) {
    // Return an empty cart in case of error
    res.status(500).json({ "cart": [] });
  }
};





/* Update cart - add, retrieve, or delete products based on user action */
exports.cart = async (req, res) => {
  const { userId, productId, action } = req.body;

  try {
    // Find the product in the database
    const product = await Product.findById(productId);
    // If the product is not found, return error message
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // findOrCreateCart function finds or creates a cart 
    const cart = await findOrCreateCart(userId);



    // Check if the product is already in the cart
    const productInCart = cart.products.find(item => item.productId.toString() === productId);


    // Handle adding a product to the cart
    if (action === 'add' && productInCart) {
      //  If the product exists, increase the quantity if stock is available
      if (product.stockLevel >= 1) {
        productInCart.quantity += 1;
        product.stockLevel -= 1;

        //  Save the updated product with new stock level
        await product.save();
      } else {
        // If product.stockLevel is 0, return error message with current cart
        return res.status(400).json({ message: 'Stock level is 0, cannot add more', cart });
      }
    }

    // Handle adding a new product to the cart (if not already in the cart)
    else if (action === 'add' && !productInCart) {


      if (product.stockLevel >= 1) {
        // Add the product to the cart with initial quantity of 1
        cart.products.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          pickAndMix: product.pickAndMix,
        });

        // Decrease stock level of the product
        product.stockLevel -= 1;

        // Save the updated product
        await product.save();


      } else {
        // If no stock is available, return error message with current cart
        return res.status(400).json({ message: 'Stock level is 0, cannot add product', cart });
      }
    }

    // Handle removing a product from the cart (decrease quantity)
    else if (action === 'remove' && productInCart) {
      // If the product quantity in the cart is 2 or more, decrease the quantity
      if (productInCart.quantity >= 2) {
        productInCart.quantity -= 1;

        // Increase stock level when quantity is reduced
        product.stockLevel += 1;
      }
      else {
        // Log if no action is taken, as the quantity is already 1
        console.log('Quantity is already 1, no action taken.');
      }
      // Save the updated product
      await product.save();

      // Handle deleting a product from the cart
    } else if (action === 'delete' && productInCart) {
      // Remove the product from the cart entirely
      cart.products = cart.products.filter(item => item.productId.toString() !== productId);

      // Revert the stock level based on quantity removed
      product.stockLevel += productInCart.quantity;

      // Save the updated product
      await product.save();

      // If the cart is empty (after removing the product), clear the entire cart
      if (cart.products.length === 0) {
        cart.products = [];  // Clear the cart
      }

    }


    else {
      // Return an error message for invalid action or if the product is not found in the cart
      return res.status(400).json({ message: 'Invalid action or product not found in cart', cart });
    }

    // Set a new expiration date for the cart (24 hours from now)
    cart.expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

    // Save the updated cart
    await cart.save();
    // Return success message with the updated cart
    res.json({ message: "Cart updated successfully", cart });
  } catch (error) {
    // Handle and return errors
    res.status(500).json({ message: "Server error" });
  }
};
