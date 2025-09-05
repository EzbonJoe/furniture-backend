const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Collection = require('../models/Collection');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const collectionData = {
  "modern-living-room": {
    title: "Modern Living Room Collection",
    description: "Elegant modern furniture for stylish living rooms.",
    backgroundImage: "/images/modern-living-room-hero.jpg",
    products: [
      {
        name: "Modern Sofa",
        description: "A comfortable modern sofa with a minimalist design.",
        priceCents: 73580,
        images: ["/images/modern sofa.jpg", "/images/modern sofa2.jpg"]
      },
      {
        name: "Glass Coffee Table",
        description: "A sleek glass coffee table that complements modern decor.",
        priceCents: 51000,
        images: ["/images/glass-coffee-table.jpg", "/images/glass-coffee-table2.jpg"]
      }
    ]
  },
  "scandinavian": {
    title: "Scandinavian Collection",
    description: "Clean, cozy, and minimal Scandinavian designs.",
    backgroundImage: '/images/scandanavian-hero-image.jpeg',
    products: [
      {
        name: "Scandinavian Chair",
        description: "A stylish Scandinavian chair with a minimalist design.",
        priceCents: 68307,
        images: ["/images/scandinavian-chair.jpg", "/images/scandinavian-chair2.jpg"]
      }
    ]
  }
};

const standaloneProducts = [
  {
    name: "Scandinavian Nightstand",
    description: "A comfortable modern sofa with a minimalist design.",
    priceCents: 73580,
    images: ["/images/dining-table.jpg", "/images/sofa2.jpg", "/images/sofa3.jpg"]
  },
  {
    name: "Bohemian Sofa",
    description: "A stylish bohemian sofa with vibrant colors.",
    priceCents: 51000,
    images: ["/images/sofa2.jpg", "/images/sofa1.jpg", "/images/sofa3.jpg"]
  },
  {
    name: "Vintage id Table",
    description: "A vintage wooden table with intricate carvings.",
    priceCents: 68300,
    images: ["/images/table.jpg", "/images/table2.jpg"]
  }
];

const seed = async () => {
  try {
    await Product.deleteMany();
    await Collection.deleteMany();

    // Insert standalone products
    await Product.insertMany(standaloneProducts);

    // Insert collections and link product IDs
    for (const key in collectionData) {
      const data = collectionData[key];
      const createdProducts = await Product.insertMany(data.products);
      console.log("Seeding collection with key:", key, "and name:", data.title);
      const collection = new Collection({
        key,
        name: data.title,
        description: data.description,
        backgroundImage: data.backgroundImage,  
        products: createdProducts.map(p => p._id)
      });
      await collection.save();

      await Promise.all(
        createdProducts.map(product => {
        product.collections = [collection._id]; // You could also push if supporting multiple
        return product.save();
      })
);
    }

    console.log("✅ Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  } 
  
};

seed();
