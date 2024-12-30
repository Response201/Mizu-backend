
const mongoose = require("mongoose");
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Receipt = require('../models/Receipts');
require('dotenv').config()
const stripe = require("stripe")(process.env.KEY);



const calculateOrderAmount = (totalPrice) => {
  const getAmount = Math.round(totalPrice * 100); 
  return getAmount;
};
exports.payment = async (req, res) => {
  const { totalPrice, discount, userId, cart } = req.body;

  try {
    // Skapa betalningsintention med Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(totalPrice),
      currency: "sek",
      automatic_payment_methods: { enabled: true },
    });

    // Skapa kvitto med information från cart
    const receipt = new Receipt({
      userId: new mongoose.Types.ObjectId(userId),
      products: cart.map(item => ({
        productId: new mongoose.Types.ObjectId(item.productId), 
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: totalPrice,
      discount: discount,
    });

   
    await receipt.save();

    /* uppdatera cart => [] */
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) }, 
      { products: [] },
      { new: true }
    );

    await updatedCart.save();

    /*  Skicka svar med clientSecret och kvitto */
    res.send({
      clientSecret: paymentIntent.client_secret,
      receipt: receipt, 
    });
  } catch (error) {
    // Logga detaljer om felet
    console.error("Error during payment processing:", error);

    // Svara med specifik felmeddelande
    res.status(500).send({ error: 'Payment failed', details: error.message });
  }
};





/* Räknar ut total pris för en användares cart, 10% för varje pick and mix grupp som uppfylls */
exports.totalPrice = async (req, res) => {
  try {

    const { userId } = req.body;

    console.log(userId)
    /*  hämta varukorgen för användaren från databasen */
    const cart = await Cart.findOne({ userId });

    /*  om ingen varukorg hittas, returnera ett fel */
    if (!cart) {
      return res.status(404).json({ error: 'Varukorgen hittades inte för användaren.' });
    }

    /* Arrayer som används för att skapa pick and mix grupper -> säkerställa att villkoren för 10% rabatt uppfylls.  */
    let serums = [];
    let faceCreams = [];
    let faceMasks = [];
    let totalPrice = 0;


    for (let product of cart.products) {
      /* Hämta produkt via dess id */
      const item = await Product.findById(product.productId);

      if (item) {
        /* Lägg till produktens pris gånger kvantiteten till totalen */
        totalPrice += item.price * product.quantity;

        /*  kontrollera produktens kategori och booleanvärde för "pick and mix" -> lägg till i rätt array om produkt uppfyller krav */
        if (item.category === "serum" && item.pickAndMix) {
          for (let i = 0; i < product.quantity; i++) {
            serums.push(item); // Lägg till serum till serums-listan
          }
        } else if (item.category === "face cream" && item.pickAndMix) {
          for (let i = 0; i < product.quantity; i++) {
            faceCreams.push(item); // Lägg till face cream till faceCreams-listan
          }
        } else if (item.category === "face mask" && item.pickAndMix) {
          for (let i = 0; i < product.quantity; i++) {
            faceMasks.push(item); // Lägg till face mask till faceMasks-listan
          }
        }
      }
    }

    /*  skapa grupper av tre produkter (serum, face cream och face mask) */
    let groups = [];
    let minLength = Math.min(serums.length, faceCreams.length, faceMasks.length);

    for (let i = 0; i < minLength; i++) {
      groups.push({
        serum: serums[i],
        faceCream: faceCreams[i],
        faceMask: faceMasks[i]
      });
    }


    /*  beräkna rabatt för varje grupp och lägg till den till totalpriset */
    let discount = 0;
    for (let group of groups) {
      const groupPrice = group.serum.price + group.faceCream.price + group.faceMask.price;
      console.log("grupp", group.serum.name, group.serum.pickAndMix, group.faceCream.name, group.faceCream.pickAndMix, group.faceMask.name, group.faceMask.pickAndMix, "grupp pris utan rabbat:", groupPrice)
      /* groupPrice * 0.10 beräknar 10% av priset, medan * 100 och / 100 justerar för två decimaler, och Math.round avrundar till närmaste hundradel.*/
      discount += Math.round(groupPrice * 0.10 * 100) / 100;
    }
    console.log("antal grupper:", groups.length, "total pris, utan rabatt :", totalPrice, "rabatt:", discount, "total pris, med rabatt :", totalPrice -
      discount
    )

    /*  minska rabattbeloppet från cartens totala belopp */
    totalPrice -= discount;

    /*  skicka tillbaka det totala priset med evt. rabatter för cart */
    res.json({ "totalprice": totalPrice, "discount": discount });
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Något gick fel vid beräkningen av det totala priset.' });
  }
};





exports.cart = async (req, res) => {
  const { userId, productId, action } = req.body;

  try {
    /* Hitta produkten i databasen */
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    /*  Hitta kundvagnen för användaren */
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    /* Hitta om produkten redan finns i kundvagnen */
    const productInCart = cart.products.find(item => item.productId.toString() === productId);

    if (action === 'add' && productInCart) {
      /*  Om produkten finns, öka kvantiteten om lager finns */
      if (product.stockLevel > 0) {
        productInCart.quantity += 1;
        product.stockLevel -= 1;
        /*   Spara uppdaterad produkt med nya lager */
        await product.save();
      } else {
        return res.status(400).json({ message: 'Stock level is 0, cannot add more', cart });
      }
    } else if (action === 'add' && !productInCart) {
      if (product.stockLevel > 0) {
        cart.products.push({
          productId: product._id,
          name: product.name, 
          price: product.price, 
          quantity: 1,
        });
        product.stockLevel -= 1;
        await product.save();
      } else {
        return res.status(400).json({ message: 'Stock level is 0, cannot add product', cart });
      }
    } else if (action === 'remove' && productInCart) {
      /*  Om produkten finns, minska kvantiteten */
      if (productInCart.quantity > 1) {
        productInCart.quantity -= 1;
        product.stockLevel += 1;  // Återställ lager
      } else {
        /*   Om kvantiteten är 1, ta bort produkten från kundvagnen */
        cart.products = cart.products.filter(item => item.productId.toString() !== productId);
        product.stockLevel += 1;  // Återställ lager
      }
      await product.save();
    } else if (action === 'delete' && productInCart) {
      /*  Om action är 'delete', ta bort produkten från kundvagnen */
      cart.products = cart.products.filter(item => item.productId.toString() !== productId);
      product.stockLevel += productInCart.quantity;  
      await product.save();
    } else {
      return res.status(400).json({ message: 'Invalid action or product not found in cart', cart });
    }

    /*  Spara uppdaterad kundvagn */
    await cart.save();

    res.json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};
