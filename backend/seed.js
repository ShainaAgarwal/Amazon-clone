require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    title: 'iPhone 15',
    price: 799,
    description: 'Apple Smartphone',
    image: 'https://m.media-amazon.com/images/I/71d7rfSl0wL._SX679_.jpg',
    category: 'Electronics',
    rating: 4.8,
    countInStock: 14
  },
  {
    title: 'Nike Running Shoes',
    price: 120,
    description: 'Comfortable running shoes',
    image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/...',
    category: 'Fashion',
    rating: 4.2,
    countInStock: 25
  },
  {
    title: 'Samsung Galaxy S24',
    price: 74999,
    description: 'Samsung flagship smartphone with AI features.',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf',
    category: 'Electronics',
    rating: 4.7,
    countInStock: 8
  },
  {
    title: 'Sony WH-1000XM5',
    price: 29999,
    description: 'Industry-leading noise cancelling headphones.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    category: 'Electronics',
    rating: 4.9,
    countInStock: 0 // 🚫 Out of stock to test filter toggles
  },
  {
    title: 'MacBook Air M3',
    price: 114999,
    description: 'Apple MacBook Air powered by M3 chip.',
    image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8',
    category: 'Electronics',
    rating: 4.6,
    countInStock: 5
  },
  {
    title: 'Dell XPS 13',
    price: 99999,
    description: 'Premium ultrabook with Intel Core processor.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    category: 'Electronics',
    rating: 4.3,
    countInStock: 3
  },
  {
    title: 'Nike Air Max',
    price: 8999,
    description: 'Comfortable running shoes.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    category: 'Fashion',
    rating: 4.5,
    countInStock: 12
  },
  {
    title: "Levi's Men's Jeans",
    price: 2499,
    description: 'Classic slim-fit denim jeans.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
    category: 'Fashion',
    rating: 3.9,
    countInStock: 0 // 🚫 Out of stock
  },
  {
    title: 'Adidas Hoodie',
    price: 3499,
    description: 'Warm and stylish hoodie.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    category: 'Fashion',
    rating: 4.1,
    countInStock: 18
  },
  {
    title: 'Casio Analog Watch',
    price: 1999,
    description: 'Elegant everyday wristwatch.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    category: 'Fashion',
    rating: 3.5,
    countInStock: 4
  },
  {
    title: 'Ray-Ban Sunglasses',
    price: 5999,
    description: 'Premium UV-protected sunglasses.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
    category: 'Fashion',
    rating: 4.4,
    countInStock: 15
  },
  {
    title: 'Atomic Habits',
    price: 499,
    description: 'Best-selling self-improvement book.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    category: 'Books',
    rating: 4.9,
    countInStock: 50
  },
  {
    title: 'Rich Dad Poor Dad',
    price: 399,
    description: 'Personal finance classic.',
    image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090',
    category: 'Books',
    rating: 4.2,
    countInStock: 22
  },
  {
    title: 'The Psychology of Money',
    price: 450,
    description: 'Insights into money and behavior.',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
    category: 'Books',
    rating: 4.6,
    countInStock: 0 // 🚫 Out of stock
  },
  {
    title: 'Wooden Study Table',
    price: 7999,
    description: 'Durable wooden desk for work and study.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    category: 'Home',
    rating: 4.0,
    countInStock: 6
  },
  {
    title: 'Office Chair',
    price: 5499,
    description: 'Ergonomic office chair.',
    image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455',
    category: 'Home',
    rating: 2.8, // ⭐️ Low rating to verify "3 Star & Up" filter rules
    countInStock: 10
  },
  {
    title: 'LED Floor Lamp',
    price: 2499,
    description: 'Modern LED floor lamp.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f',
    category: 'Home',
    rating: 4.1,
    countInStock: 14
  },
  {
    title: 'Cricket Bat',
    price: 2999,
    description: 'Professional-grade cricket bat.',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
    category: 'Sports',
    rating: 4.5,
    countInStock: 7
  },
  {
    title: 'Football',
    price: 999,
    description: 'Official size football.',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974',
    category: 'Sports',
    rating: 3.8,
    countInStock: 30
  },
  {
    title: 'Yoga Mat',
    price: 799,
    description: 'Anti-slip yoga mat.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    category: 'Sports',
    rating: 4.3,
    countInStock: 0 // 🚫 Out of stock
  },
  {
    title: 'Organic Almonds 1kg',
    price: 899,
    description: 'Premium quality almonds.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    category: 'Grocery',
    rating: 4.7,
    countInStock: 40
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await Product.deleteMany({});
    console.log('Existing products removed');

    await Product.insertMany(products);
    console.log(`${products.length} products inserted successfully`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}
seed();