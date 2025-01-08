const Cart = require('../models/Cart'); 
const Product = require('../models/Product');



exports.cleanUpExpiredCarts = async () => {
    try {
      console.log("Rensar förfallna varukorgar och återställer lager...");
  
      // Hitta alla varukorgar med förfluten expireDate
      const expiredCarts = await Cart.find({ expiresAt: { $lt: new Date() } });
  
            // Om inga varukorgar är förfallna, gör inget
      if (expiredCarts.length === 0) {
        console.log("Ingen förfallen varukorg att rensa.");
        return;
      }
  
      // För varje varukorg, uppdatera lager och ta bort varukorgen
      for (const cart of expiredCarts) {
        for (const item of cart.products) {
          const product = await Product.findById(item.productId);
          
          if (product) {
            product.stockLevel += item.quantity;
            await product.save();
          } else {
            console.warn(`Produkt med ID ${item.productId} inte hittad i databasen.`);
          }
        }
        
        // Ta bort varukorgen från databasen efter att produkterna har återställts
        await Cart.findByIdAndDelete(cart.userId);
      }
  
      console.log(`${expiredCarts.length} förfallna varukorgar rensade.`);
    } catch (error) {
      console.error("Fel vid rensning av förfallna varukorgar:", error);
    }
  };