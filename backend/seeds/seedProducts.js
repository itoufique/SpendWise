const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');

const run = async () => {
  await connectDB();

  try {
    // Remove existing categories and products to keep only the new Indian electronics samples
    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoriesData = [
      { name: 'Electronics', slug: 'electronics', description: 'Indian electronics and accessories with laptops, mobiles, audio, and gadgets.' },
      { name: 'Mobiles', slug: 'mobiles', description: 'Smartphones, mobile accessories, and budget-friendly handsets.' },
      { name: 'Home Appliances', slug: 'home-appliances', description: 'Essential home and kitchen appliances for everyday living.' },
      { name: 'Fashion', slug: 'fashion', description: 'Trendy apparel, accessories, and style essentials.' },
      { name: 'Home & Living', slug: 'home-living', description: 'Home decor, furnishings, and lifestyle products.' },
    ];

    const createdCategories = {};
    for (const categoryData of categoriesData) {
      const category = await Category.create(categoryData);
      createdCategories[category.slug] = category;
    }

    const makeProduct = (categorySlug, brand, modelName, index, price, rating) => ({
      title: `${brand} ${modelName} ${index}`,
      description: `High-quality ${modelName} by ${brand}. Great performance and value.`,
      categorySlug,
      brand,
      price,
      rating,
      images: [`/images/product/${encodeURIComponent(brand)}/${encodeURIComponent(modelName)}/${index}.svg`],
      features: [`${modelName} feature A`, `${modelName} feature B`],
      specs: { model: `${brand}-${modelName}`, warranty: '1 year' },
      stock: 50 + index,
    });

    const categoryTemplates = {
      electronics: {
        brands: ['boAt', 'Noise', 'Zebronics', 'Portronics', 'Syska', 'Intex', 'iBall', 'Micromax', 'Redragon', 'Lava'],
        models: ['Wireless Mouse', 'Gaming Mouse', 'Silent Mouse', 'Ergonomic Mouse', 'Mini Mouse', 'Vertical Mouse', 'Trackball Mouse', 'Optical Mouse', 'Laser Mouse', 'Rechargeable Mouse'],
        priceFn: (i) => Math.min(10000, 100 + i * 200),
      },
      mobiles: {
        brands: ['Redmi', 'Realme', 'Samsung', 'OnePlus', 'Vivo', 'Oppo', 'Micromax', 'Lava', 'Intex', 'itel'],
        models: ['Edge 5G', 'Zoom Pro', 'Power Max', 'Neo Lite', 'Ultra Plus', 'Sonic Mini', 'Prime X', 'Air Pro', 'Ace 2024', 'Mini S'],
        priceFn: (i) => Math.min(10000, 100 + i * 180),
      },
      'home-appliances': {
        brands: ['Havells', 'Orient', 'Crompton', 'Bajaj', 'Philips', 'Usha', 'IFB', 'LG', 'Whirlpool', 'V-Guard'],
        models: ['Air Cooler', 'Blender', 'Juicer', 'Iron', 'Mixer Grinder', 'Desk Fan', 'Water Purifier', 'Vacuum Cleaner', 'RO System', 'Toaster Oven'],
        priceFn: (i) => Math.min(10000, 500 + i * 180),
      },
      fashion: {
        brands: ['Levis', 'Peter England', 'Nike', 'Adidas', 'Campus', 'Roadster', 'Being Human', 'Wrogn', 'United Colors', 'Allen Solly'],
        models: ['Graphic T-Shirt', 'Slim Jeans', 'Running Sneakers', 'Bomber Jacket', 'Zip Hoodie', 'Denim Shirt', 'Casual Shorts', 'Leather Belt', 'Sport Cap', 'Track Pants'],
        priceFn: (i) => Math.min(10000, 100 + i * 140),
      },
      'home-living': {
        brands: ['Corelle', 'Cello', 'AmazonBasics', 'Hawkins', 'GreenChef', 'Bedsure', 'Urban Ladder', 'Nilkamal', 'Solimo', 'Wakefit'],
        models: ['Dinner Set', 'Cushion Set', 'Wall Art', 'Floor Lamp', 'Storage Box', 'Bed Sheet Set', 'Curtain Panel', 'Rug Mat', 'Table Lamp', 'Coffee Table'],
        priceFn: (i) => Math.min(10000, 150 + i * 180),
      },
    };

    const allProducts = [];
    let globalIndex = 1;

    for (const category of categoriesData) {
      const template = categoryTemplates[category.slug];
      for (let i = 0; i < 50; i += 1) {
        const brand = template.brands[i % template.brands.length];
        let modelName;
        let price;
        let rating = Number((3.8 + (i % 5) * 0.1).toFixed(1));

        if (category.slug === 'electronics' && i >= 45) {
          const laptopModels = ['Gaming Laptop', 'Pro Laptop', 'Ultra Laptop', 'Creator Laptop', 'Turbo Laptop'];
          modelName = laptopModels[i - 45];
          price = 12000 + (i - 45) * 1500;
          rating = Number((4.2 + ((i - 45) % 3) * 0.1).toFixed(1));
        } else {
          const modelBase = template.models[i % template.models.length];
          const variant = Math.floor(i / template.models.length) + 1;
          modelName = `${modelBase} Series ${variant}`;
          price = template.priceFn(i + 1);
        }

        allProducts.push(makeProduct(category.slug, brand, modelName, globalIndex, price, rating));
        globalIndex += 1;
      }
    }

    // Attach category ids and insert
    const toInsert = allProducts.map((p) => ({
      title: p.title,
      description: p.description,
      category: createdCategories[p.categorySlug]._id,
      brand: p.brand,
      price: p.price,
      rating: p.rating,
      images: p.images,
      features: p.features,
      specs: p.specs,
      stock: p.stock,
    }));

    const createdProducts = await Product.insertMany(toInsert);

    console.log(`Inserted ${createdProducts.length} products across ${Object.keys(createdCategories).length} categories.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

run();
