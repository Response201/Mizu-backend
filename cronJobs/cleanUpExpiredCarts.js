const Cart = require('../models/Carts');
const Product = require('../models/Products');

// Function to clean up expired cart from the Carts

exports.cleanUpExpiredCarts = async () => {
  try {

    // Find all carts with an expired `expiresAt` date
    const expiredCarts = await Cart.find({ expiresAt: { $lt: new Date() } });

    // If no expired carts are found, do nothing
    if (expiredCarts.length === 0) {
      console.log("Ingen förfallen varukorg att rensa.");
      return;
    }


    // Loop through each expired cart and update product stock levels, then delete the cart
    for (const cart of expiredCarts) {
      for (const item of cart.products) {
        const product = await Product.findById(item.productId);

        if (product) {
          // Restore the stock level by adding the quantity from the expired cart
          product.stockLevel += item.quantity;
          // Save the updated product
          await product.save();
        } else {
          // Warn if the product is not found in the database
          console.warn(`Produkt med ID ${item.productId} inte hittad i databasen.`);
        }
      }



      // After restoring stock, delete the expired cart
      await Cart.findByIdAndDelete(cart._id);
    }



    // Log the number of expired carts cleaned up
    console.log(`${expiredCarts.length} förfallna varukorgar rensade.`);


  } catch (error) {
    // Log any errors during the cleanup process
    console.error("Fel vid rensning av förfallna varukorgar:", error);
  }
};