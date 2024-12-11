const Product = require('../models/Product');



/*This function checks if specific products exist in the database. 
If a product is not found, it creates a new entry */

const seedProducts = async () => {

  try {

    const products = [
      {
        name: "Divine Hyper Essence",
        image: "https://i.ibb.co/sRxRDnJ/Product1.png",
        primaryColor: "#f3e3d4",
        price: 599,
        pickAndMix: true,
        stockLevel: 3,
        category: "face mask",
        ratings: []
      },
      {
        name: "Luminous Glow",
        image: "https://i.ibb.co/sRxRDnJ/Product1.png",
        primaryColor: "#f3e3d4",
        price: 599,
        stockLevel: 3,
        category: "face mask",
        ratings: []
      },
      {
        name: "Radiant Glow",
        image: "https://i.ibb.co/w6CBZh8/Product3.png",
        primaryColor: "#e6ccbb",
        price: 749,
        pickAndMix: true,
        stockLevel: 5,
        category: "serum",
        ratings: []
      },
      {
        name: "Glow Revive",
        image: "https://i.ibb.co/w6CBZh8/Product3.png",
        primaryColor: "#e6ccbb",
        price: 749,
        stockLevel: 5,
        category: "serum",
        ratings: []
      },
      {
        name: "Golden Essence Lux",
        image: "https://i.ibb.co/dfSJHFH/Product2.png",
        primaryColor: "#f2e1d9",
        price: 899,
        pickAndMix: true,
        category: "face cream",
        stockLevel: 1,
        ratings: []
      },
      {
        name: "Ultra Calm Toner",
        image: "https://i.ibb.co/toner1.png",
        primaryColor: "#dde7f0",
        price: 299,
        stockLevel: 10,
        category: "toner",
        ratings: []
      },
      {
        name: "Soothing Facial Toner",
        image: "https://i.ibb.co/toner2.png",
        primaryColor: "#dde7f0",
        price: 349,
        stockLevel: 8,
        category: "toner",
        ratings: []
      },
      {
        name: "Renew Eye Cream",
        image: "https://i.ibb.co/eyecream1.png",
        primaryColor: "#fff2e6",
        price: 499,
        stockLevel: 6,
        category: "eye cream",
        ratings: []
      },
      {
        name: "Bright Eyes Gel",
        image: "https://i.ibb.co/eyecream1.png",
        primaryColor: "#fff2e6",
        price: 549,
        stockLevel: 7,
        category: "eye cream",
        ratings: []
      },
      {
        name: "Hydro Boost Moisturizer",
        image: "https://i.ibb.co/moisturizer1.png",
        primaryColor: "#dff1e2",
        price: 399,
        stockLevel: 12,
        category: "moisturizer",
        ratings: []
      },
      {
        name: "Deep Nourish Cream",
        image: "https://i.ibb.co/moisturizer2.png",
        primaryColor: "#dff1e2",
        price: 449,
        stockLevel: 9,
        category: "moisturizer",
        ratings: []
      },
      {
        name: "Exfoliating Scrub",
        image: "https://i.ibb.co/exfoliator1.png",
        primaryColor: "#fde5c6",
        price: 499,
        stockLevel: 4,
        category: "exfoliator",
        ratings: []
      },
      {
        name: "Gentle Face Polish",
        image: "https://i.ibb.co/exfoliator2.png",
        primaryColor: "#fde5c6",
        price: 599,
        stockLevel: 3,
        category: "exfoliator",
        ratings: []
      },
      {
        name: "Daily UV Shield",
        image: "https://i.ibb.co/sunscreen1.png",
        primaryColor: "#fcebcf",
        price: 349,
        stockLevel: 15,
        category: "sunscreen",
        ratings: []
      },
      {
        name: "Sunblock Matte Finish",
        image: "https://i.ibb.co/sunscreen2.png",
        primaryColor: "#fcebcf",
        price: 399,
        stockLevel: 13,
        category: "sunscreen",
        ratings: []
      }
    ];




    for (const product of products) {
      const existingProduct = await Product.findOne({ name: product.name });
      if (!existingProduct) {
        await Product.create(product);
        console.log(`Inserted: ${product.name}`);
      } else {
        console.log(`Already exists: ${product.name}`);
      }
    }

  } catch (err) {

    console.error("Error seeding products:", err);
  }
};



module.exports = seedProducts;