const Product = require('../models/Product');



/*This function checks if specific products exist in the database. 
If a product is not found, it creates a new entry */

const seedProducts = async () => {

  try {

    const products = [
      {
        name: "TEST TOTALT 10 PRODUKTER",
        description: "Test test",
        image: "https://i.ibb.co/sRxRDnJ/Product1.png",
        primaryColor: "#d5c5b4",
        price: 300,
        pickAndMix: true,
        stockLevel: 10,
        category: "face mask",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Divine Hyper Essence",
        description: "A luxurious face mask that deeply hydrates and revitalizes your skin, leaving it radiant and smooth.",
        image: "https://i.ibb.co/sRxRDnJ/Product1.png",
        primaryColor: "#d5c5b4",
        price: 599,
        pickAndMix: true,
        stockLevel: 3,
        category: "face mask",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Luminous Glow",
        description: "An illuminating face mask designed to enhance your skin's natural glow and radiance.",
        image: "https://i.ibb.co/sRxRDnJ/Product1.png",
        primaryColor: "#d5c5b4",
        price: 599,
        stockLevel: 3,
        category: "face mask",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Radiant Glow",
        description: "A powerful serum that boosts skin radiance and improves texture for a flawless finish.",
        image: "https://i.ibb.co/w6CBZh8/Product3.png",
        primaryColor: "#cbb9a9",
        price: 749,
        pickAndMix: true,
        stockLevel: 5,
        category: "serum",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Glow Revive",
        description: "A rejuvenating serum that revitalizes tired skin, promoting a youthful and healthy appearance.",
        image: "https://i.ibb.co/w6CBZh8/Product3.png",
        primaryColor: "#cbb9a9",
        price: 749,
        stockLevel: 5,
        category: "serum",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Golden Essence Lux",
        description: "A premium face cream infused with golden essence for intense hydration and a luminous complexion.",
        image: "https://i.ibb.co/dfSJHFH/Product2.png",
        primaryColor: "#d3c2b5",
        price: 899,
        pickAndMix: true,
        category: "face cream",
        stockLevel: 1,
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Ultra Calm Toner",
        description: "A gentle toner that soothes and calms irritated skin while maintaining a balanced complexion.",
        image: "https://i.ibb.co/toner1.png",
        primaryColor: "#bfc8d0",
        price: 299,
        stockLevel: 10,
        category: "toner",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Soothing Facial Toner",
        description: "A refreshing toner crafted to hydrate and soothe your skin, providing an even-toned finish.",
        image: "https://i.ibb.co/toner2.png",
        primaryColor: "#bfc8d0",
        price: 349,
        stockLevel: 8,
        category: "toner",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Renew Eye Cream",
        description: "A nourishing eye cream that reduces puffiness and dark circles for brighter-looking eyes.",
        image: "https://i.ibb.co/eyecream1.png",
        primaryColor: "#e6d3c2",
        price: 499,
        stockLevel: 6,
        category: "eye cream",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Bright Eyes Gel",
        description: "A cooling gel that brightens and refreshes the under-eye area for an awake and youthful look.",
        image: "https://i.ibb.co/eyecream1.png",
        primaryColor: "#e6d3c2",
        price: 549,
        stockLevel: 7,
        category: "eye cream",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Hydro Boost Moisturizer",
        description: "A lightweight moisturizer that provides deep hydration and locks in moisture all day long.",
        image: "https://i.ibb.co/moisturizer1.png",
        primaryColor: "#b9dbcb",
        price: 399,
        stockLevel: 12,
        category: "moisturizer",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Deep Nourish Cream",
        description: "A rich cream that deeply nourishes and restores dry skin, leaving it soft and supple.",
        image: "https://i.ibb.co/moisturizer2.png",
        primaryColor: "#b9dbcb",
        price: 449,
        stockLevel: 9,
        category: "moisturizer",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Exfoliating Scrub",
        description: "A gentle exfoliator that removes dead skin cells to reveal smoother and brighter skin.",
        image: "https://i.ibb.co/exfoliator1.png",
        primaryColor: "#e1c7a8",
        price: 499,
        stockLevel: 4,
        category: "exfoliator",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Gentle Face Polish",
        description: "A refining face polish that exfoliates delicately, leaving your skin soft and glowing.",
        image: "https://i.ibb.co/exfoliator2.png",
        primaryColor: "#e1c7a8",
        price: 599,
        stockLevel: 3,
        category: "exfoliator",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Daily UV Shield",
        description: "A lightweight sunscreen offering broad-spectrum protection with a non-greasy finish.",
        image: "https://i.ibb.co/sunscreen1.png",
        primaryColor: "#e2c8ab",
        price: 349,
        stockLevel: 15,
        category: "sunscreen",
        ratings: [],
        averageRating: 0,
      },
      {
        name: "Sunblock Matte Finish",
        description: "A matte-finish sunscreen that protects against UV damage and controls excess shine.",
        image: "https://i.ibb.co/sunscreen2.png",
        primaryColor: "#e2c8ab",
        price: 399,
        stockLevel: 13,
        category: "sunscreen",
        ratings: [],
        averageRating: 0,
      },
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