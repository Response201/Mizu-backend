const Product = require('../models/Products');



/*This function checks if specific products exist in the database. 
If a product is not found, it creates a new entry */

const seedProducts = async () => {

  try {

    const products = [

    
        {
          "name": "Hydrating Cream",
          "description": "An intensely moisturizing face cream that helps maintain the skin's natural hydration balance, leaving it soft and smooth.",
          "image": "https://i.ibb.co/d4thjzT/2.png",
          "primaryColor": "129, 193, 185",
          "price": 499,
          "pickAndMix": true,
          "stockLevel": 10,
          "category": "face cream",
          "ratings": [],
          "averageRating": 0
        },
  
        {
          "name": "Brightening Vitamin C Cream",
          "description": "A nourishing face cream with vitamin C to brighten and even out skin tone.",
          "image": "https://i.ibb.co/GJTCHkD/3.png",
          "primaryColor": "129, 193, 185",
          "price": 649,
          "pickAndMix": true,
          "stockLevel": 5,
          "category": "face cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Hydrating Overnight Cream",
          "description": "A rich, hydrating cream that works overnight to restore moisture and plump the skin.",
          "image": "https://i.ibb.co/z8Kk77Q/4.png",
          "primaryColor": "129, 193, 185",
          "price": 799,
          "pickAndMix": true,
          "stockLevel": 3,
          "category": "face cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Hydrating Day Cream",
          "description": "A lightweight daily cream that provides long-lasting hydration and keeps your skin feeling fresh throughout the day.",
          "image": "https://i.ibb.co/yn10xbK/5.png",
          "primaryColor": "129, 193, 185",
          "price": 549,
          "pickAndMix": true,
          "stockLevel": 14,
          "category": "face cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Revitalizing Night Cream",
          "description": "A nourishing night cream infused with antioxidants to repair and rejuvenate your skin while you sleep.",
          "image": "https://i.ibb.co/rcGYjqv/7.png",
          "primaryColor": "129, 193, 185",
          "price": 399,
          "pickAndMix": false,
          "stockLevel": 9,
          "category": "face cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Calming Sensitive Skin Cream",
          "description": "A gentle face cream designed to soothe and protect sensitive skin, enriched with chamomile and oatmeal.",
          "image": "https://i.ibb.co/Dt0xMYz/8.png",
          "primaryColor": "129, 193, 185",
          "price": 369,
          "pickAndMix": false,
          "stockLevel": 6,
          "category": "face cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Golden Essence Lux",
          "description": "A premium face cream infused with golden essence for intense hydration and a luminous complexion.",
          "image": "https://i.ibb.co/WnqBGTd/6.png",
          "primaryColor": "129, 193, 185",
          "price": 899,
          "pickAndMix": true,
          "stockLevel": 5,
          "category": "face cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Brightening Glow Cream",
          "description": "A radiance-boosting face cream with Vitamin C and natural botanicals to brighten and even out skin tone.",
          "image": "https://i.ibb.co/1f6pZWF/facecream.png",
          "primaryColor": "129, 193, 185",
          "price": 429,
          "pickAndMix": true,
          "stockLevel": 9,
          "category": "face cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Daily UV Shield",
          "description": "A lightweight sunscreen offering broad-spectrum protection with a non-greasy finish.",
          "image": "https://i.ibb.co/7b5dYnG/sun1.png",
          "primaryColor": "194, 189, 216",
          "price": 349,
          "pickAndMix": false,
          "stockLevel": 15,
          "category": "sunscreen",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Sunblock Matte Finish",
          "description": "A matte-finish sunscreen that protects against UV damage and controls excess shine.",
          "image": "https://i.ibb.co/7j4jBM6/sun2.png",
          "primaryColor": "194, 189, 216",
          "price": 399,
          "pickAndMix": false,
          "stockLevel": 12,
          "category": "sunscreen",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Hydrating Sunscreen SPF 50",
          "description": "A hydrating sunscreen with SPF 50 that provides high protection while keeping the skin moisturized and refreshed.",
          "image": "https://i.ibb.co/8gz7zQt/sun3.png",
          "primaryColor": "194, 189, 216",
          "price": 499,
          "pickAndMix": false,
          "stockLevel": 15,
          "category": "sunscreen",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Mineral Sun Shield SPF 30",
          "description": "A mineral-based sunscreen that offers broad-spectrum protection with SPF 30, ideal for sensitive skin and outdoor activities.",
          "image": "https://i.ibb.co/J5QCrxg/sun4.png",
          "primaryColor": "194, 189, 216",
          "price": 399,
          "pickAndMix": false,
          "stockLevel": 10,
          "category": "sunscreen",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Invisible SPF 50",
          "description": "An ultra-light sunscreen that provides high protection without leaving a white cast.",
          "image": "https://i.ibb.co/vZd6P49/sun5.png",
          "primaryColor": "194, 189, 216",
          "price": 499,
          "pickAndMix": false,
          "stockLevel": 6,
          "category": "sunscreen",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Sensitive Skin Sunscreen",
          "description": "A hypoallergenic sunscreen designed for sensitive skin, offering maximum UV protection.",
          "image": "https://i.ibb.co/Qpz5SXH/sun6.png",
          "primaryColor": "194, 189, 216",
          "price": 399,
          "pickAndMix": false,
          "stockLevel": 7,
          "category": "sunscreen",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Divine Hyper Essence",
          "description": "A luxurious face mask that deeply hydrates and revitalizes your skin, leaving it radiant and smooth.",
          "image": "https://i.ibb.co/vQcbPrJ/mask1.png",
          "primaryColor": "195, 207, 160",
          "price": 599,
          "pickAndMix": true,
          "stockLevel": 3,
          "category": "face mask",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Luminous Glow",
          "description": "An illuminating face mask designed to enhance your skin's natural glow and radiance.",
          "image": "https://i.ibb.co/z2MKK81/mask2.png",
          "primaryColor": "195, 207, 160",
          "price": 559,
          "pickAndMix": true,
          "stockLevel": 9,
          "category": "face mask",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Purifying Charcoal Mask",
          "description": "A detoxifying face mask with activated charcoal that deeply cleanses pores and removes impurities for smoother skin.",
          "image": "https://i.ibb.co/2t0kHwX/mask3.png",
          "primaryColor": "195, 207, 160",
          "price": 599,
          "pickAndMix": true,
          "stockLevel": 8,
          "category": "face mask",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Aloe Hydration Mask",
          "description": "A soothing face mask infused with aloe vera to deeply hydrate and calm dry, irritated skin.",
          "image": "https://i.ibb.co/tpqsY13/mask4.png",
          "primaryColor": "195, 207, 160",
          "price": 429,
          "pickAndMix": true,
          "stockLevel": 8,
          "category": "face mask",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Brightening Vitamin C Mask",
          "description": "A brightening mask with Vitamin C that helps even skin tone, reduce dark spots, and enhance radiance.",
          "image": "https://i.ibb.co/CnTs6vY/mask5.png",
          "primaryColor": "195, 207, 160",
          "price": 599,
          "pickAndMix": true,
          "stockLevel": 12,
          "category": "face mask",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Anti-Aging Retinol Mask",
          "description": "An anti-aging mask with retinol that reduces the appearance of fine lines and wrinkles, giving the skin a youthful glow.",
          "image": "https://i.ibb.co/8BTBQ4h/mask6.png",
          "primaryColor": "195, 207, 160",
          "price": 549,
          "pickAndMix": false,
          "stockLevel": 8,
          "category": "face mask",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Nourishing Honey Mask",
          "description": "A luxurious honey mask that deeply nourishes and softens the skin, leaving it feeling hydrated and replenished.",
          "image": "https://i.ibb.co/Chjzxwb/mask7.png",
          "primaryColor": "195, 207, 160",
          "price": 649,
          "pickAndMix": true,
          "stockLevel": 8,
          "category": "face mask",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Radiant Glow",
          "description": "A powerful serum that boosts skin radiance and improves texture for a flawless finish.",
          "image": "https://i.ibb.co/P4D5TKB/serum1.png",
          "primaryColor": "240, 175, 135",
          "price": 749,
          "pickAndMix": true,
          "stockLevel": 7,
          "category": "serum",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Glow Revive",
          "description": "A rejuvenating serum that revitalizes tired skin, promoting a youthful and healthy appearance.",
          "image": "https://i.ibb.co/Xp5jhbJ/serum2.png",
          "primaryColor": "240, 175, 135",
          "price": 749,
          "pickAndMix": true,
          "stockLevel": 2,
          "category": "serum",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Gold Infusion Serum",
          "description": "A luxurious serum infused with gold particles to boost skin radiance and reduce wrinkles.",
          "image": "https://i.ibb.co/x5BY13N/serum3.png",
          "primaryColor": "240, 175, 135",
          "price": 899,
          "pickAndMix": true,
          "stockLevel": 5,
          "category": "serum",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Super Hydrating Serum",
          "description": "A deeply hydrating serum that plumps the skin and reduces the appearance of fine lines.",
          "image": "https://i.ibb.co/vzjtzz3/serum4.png",
          "primaryColor": "240, 175, 135",
          "price": 799,
          "pickAndMix": true,
          "stockLevel": 5,
          "category": "serum",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Brightening Vitamin C Serum",
          "description": "An antioxidant-rich serum infused with Vitamin C to brighten dull skin and reduce the appearance of dark spots.",
          "image": "https://i.ibb.co/QfpX0BF/serum5.png",
          "primaryColor": "240, 175, 135",
          "price": 449,
          "pickAndMix": false,
          "stockLevel": 8,
          "category": "serum",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Hyaluronic Acid Serum",
          "description": "A deep hydrating serum with hyaluronic acid that locks in moisture and plumps the skin for a smooth, radiant complexion.",
          "image": "https://i.ibb.co/jTjJ0QN/serum6.png",
          "primaryColor": "240, 175, 135",
          "price": 399,
          "pickAndMix": false,
          "stockLevel": 5,
          "category": "serum",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Retinol Repair Serum",
          "description": "A powerful serum with retinol to accelerate skin cell turnover, reducing fine lines and promoting youthful skin.",
          "image": "https://i.ibb.co/JBffjt0/serum7.png",
          "primaryColor": "240, 175, 135",
          "price": 599,
          "pickAndMix": true,
          "stockLevel": 5,
          "category": "serum",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Anti-Pollution Serum",
          "description": "A protective serum that shields the skin from environmental pollutants and helps detoxify and restore skin health.",
          "image": "https://i.ibb.co/5WZG7js/serum8.png",
          "primaryColor": "240, 175, 135",
          "price": 499,
          "pickAndMix": true,
          "stockLevel": 6,
          "category": "serum",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Refresh Eye Gel",
          "description": "A cooling gel for the eye area that helps reduce puffiness and provides a fresh, awakened appearance.",
          "image": "https://i.ibb.co/cckn1By/eye1.png",
          "primaryColor": "237, 203, 118",
          "price": 399,
          "pickAndMix": false,
          "stockLevel": 5,
          "category": "eye cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Brightening Eye Gel",
          "description": "A cooling eye gel that reduces puffiness and dark circles, leaving your eyes refreshed and awake.",
          "image": "https://i.ibb.co/wKsRVNf/eye2.png",
          "primaryColor": "237, 203, 118",
          "price": 289,
          "pickAndMix": false,
          "stockLevel": 14,
          "category": "eye cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Anti-Aging Eye Balm",
          "description": "A luxurious eye balm enriched with peptides to reduce fine lines and wrinkles around the delicate eye area.",
          "image": "https://i.ibb.co/PYBN2Fp/eye3.png",
          "primaryColor": "237, 203, 118",
          "price": 399,
          "pickAndMix": false,
          "stockLevel": 8,
          "category": "eye cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Hydrating Eye Cream",
          "description": "A deeply hydrating eye cream infused with hyaluronic acid to keep the under-eye area soft and smooth.",
          "image": "https://i.ibb.co/yd8jcB6/eye4.png",
          "primaryColor": "237, 203, 118",
          "price": 329,
          "pickAndMix": false,
          "stockLevel": 8,
          "category": "eye cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Bright Eyes Gel",
          "description": "A cooling gel that brightens and refreshes the under-eye area for an awake and youthful look.",
          "image": "https://i.ibb.co/wcRvfP3/eye5.png",
          "primaryColor": "237, 203, 118",
          "price": 549,
          "pickAndMix": false,
          "stockLevel": 4,
          "category": "eye cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Renew Eye Cream",
          "description": "A nourishing eye cream that reduces puffiness and dark circles for brighter-looking eyes.",
          "image": "https://i.ibb.co/yNyqw8w/eye6.png",
          "primaryColor": "237, 203, 118",
          "price": 499,
          "pickAndMix": false,
          "stockLevel": 8,
          "category": "eye cream",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Hydro Boost Moisturizer",
          "description": "A lightweight moisturizer that provides deep hydration and locks in moisture all day long.",
          "image": "https://i.ibb.co/R0mZJY2/skin1.png",
          "primaryColor": "237, 187, 181",
          "price": 399,
          "pickAndMix": false,
          "stockLevel": 10,
          "category": "moisturizer",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Deep Nourish Cream",
          "description": "A rich cream that deeply nourishes and restores dry skin, leaving it soft and supple.",
          "image": "https://i.ibb.co/Hpq1Sqk/skin2.png",
          "primaryColor": "237, 187, 181",
          "price": 449,
          "pickAndMix": false,
          "stockLevel": 8,
          "category": "moisturizer",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Hydrating Night Cream",
          "description": "A rich night cream that deeply hydrates and repairs your skin overnight, leaving it soft and refreshed by morning.",
          "image": "https://i.ibb.co/FKZfR5q/skin3.png",
          "primaryColor": "237, 187, 181",
          "price": 499,
          "pickAndMix": false,
          "stockLevel": 7,
          "category": "moisturizer",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Rejuvenating Day Cream",
          "description": "A lightweight day cream that provides long-lasting moisture and protection against environmental stressors.",
          "image": "https://i.ibb.co/vdMPcnB/skin4.png",
          "primaryColor": "237, 187, 181",
          "price": 449,
          "pickAndMix": false,
          "stockLevel": 8,
          "category": "moisturizer",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Anti-Aging Retinol Cream",
          "description": "An anti-aging moisturizer enriched with retinol to reduce fine lines and wrinkles, revealing smoother, younger-looking skin.",
          "image": "https://i.ibb.co/fGqqXzR/skin5.png",
          "primaryColor": "237, 187, 181",
          "price": 799,
          "pickAndMix": false,
          "stockLevel": 2,
          "category": "moisturizer",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Calming Aloe Moisturizer",
          "description": "A soothing moisturizer with aloe vera that calms irritated skin while providing deep hydration and a smooth texture.",
          "image": "https://i.ibb.co/TL00mMF/skin6.png",
          "primaryColor": "237, 187, 181",
          "price": 399,
          "pickAndMix": false,
          "stockLevel": 10,
          "category": "moisturizer",
          "ratings": [],
          "averageRating": 0
        },
        {
          "name": "Nourishing Vitamin C Cream",
          "description": "A brightening cream packed with Vitamin C to rejuvenate and brighten dull, tired skin for a youthful glow.",
          "image": "https://i.ibb.co/txbVzp6/skin7.png",
          "primaryColor": "237, 187, 181",
          "price": 699,
          "pickAndMix": false,
          "stockLevel": 4,
          "category": "moisturizer",
          "ratings": [],
          "averageRating": 0
        }
      
      

    ]



    for (const product of products) {

      // Check if a product with the same name exists
      const existingProduct = await Product.findOne({ name: product.name });

      if (!existingProduct) {
        // If the product does not exist, create a new product entry in the database
        await Product.create(product);
        console.log(`Inserted: ${product.name}`);

      } else {

        // If the product already exists, log that it was found
        console.log(`Already exists: ${product.name}`);
      }
    }

  } catch (err) {
    // If any error occurs during the process, log it
    console.error("Error seeding products:", err);
  }
};


 
module.exports = seedProducts; 
