/**
 * Vendora — Database Seed Script
 * 
 * Usage: node seed.js (from server/ directory)
 * 
 * Clears existing products and inserts a curated catalog of
 * sample products across all 6 categories with real Unsplash images.
 */

const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Product = require('./models/Product.js')

dotenv.config()

const products = [
  // ── Electronics ────────────────────────────────────────────
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with exceptional sound quality. 30-hour battery life, soft-fit leather earpads, and multipoint connection for seamless switching between two devices.',
    price: 29990,
    category: 'Electronics',
    stock: 24,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
  },
  {
    name: 'Apple iPad Air (5th Gen)',
    description: 'Supercharged by the M1 chip. 10.9-inch Liquid Retina display, 5G capable, available in five gorgeous colors. Supports Apple Pencil and Magic Keyboard.',
    price: 59900,
    category: 'Electronics',
    stock: 16,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'The most advanced Master Series mouse with ultra-fast MagSpeed scrolling, 8K DPI sensor, and whisper-quiet clicks. Works on glass, ergonomic design.',
    price: 8995,
    category: 'Electronics',
    stock: 38,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
  },

  // ── Clothing ────────────────────────────────────────────────
  {
    name: 'Premium Cotton Linen Shirt',
    description: 'A breathable summer essential crafted from a relaxed cotton-linen blend. Features a classic collar, mother-of-pearl buttons, and a relaxed fit perfect for both casual and smart-casual occasions.',
    price: 2499,
    category: 'Clothing',
    stock: 55,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
  },
  {
    name: 'Wool Blend Overcoat',
    description: 'A sophisticated overcoat in a warm wool-polyester blend. Double-breasted with tortoiseshell buttons, full lining, and side pockets. An investment piece for years of stylish warmth.',
    price: 6999,
    category: 'Clothing',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80',
  },
  {
    name: 'Classic White Sneakers',
    description: 'Timeless minimalist sneakers with a genuine leather upper, cushioned insole, and vulcanized rubber sole. The shoe that goes with literally everything.',
    price: 3499,
    category: 'Clothing',
    stock: 42,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },

  // ── Books ────────────────────────────────────────────────────
  {
    name: 'Atomic Habits — James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. Over 10 million copies sold. Tiny changes, remarkable results — a practical guide to behaviour change that will transform how you live and work.',
    price: 499,
    category: 'Books',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
  },
  {
    name: 'The Design of Everyday Things',
    description: 'Don Norman\'s seminal work on user-centered design. A must-read for designers, engineers, and anyone who wants to understand why some products delight while others frustrate.',
    price: 699,
    category: 'Books',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&q=80',
  },

  // ── Home ─────────────────────────────────────────────────────
  {
    name: 'Ceramic Pour-Over Coffee Set',
    description: 'Hand-thrown matte ceramic pour-over dripper and server set. Holds 500ml, features a built-in filter holder, and comes in a natural speckled glaze. Brews 2 perfect cups.',
    price: 1899,
    category: 'Home',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  },
  {
    name: 'Linen Pillow Cover Set (2 pcs)',
    description: 'Pure linen pillow covers with a washed finish for that effortlessly lived-in look. Hidden zipper closure, available in natural, charcoal, and terracotta. Machine washable. Size: 45×45cm.',
    price: 1249,
    category: 'Home',
    stock: 70,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80',
  },
  {
    name: 'Marble & Acacia Wood Serving Board',
    description: 'A stunning combination of white carrara marble and acacia wood. Ideal for charcuterie, cheese, or as a kitchen statement piece. 40×25cm, easy to clean.',
    price: 2199,
    category: 'Home',
    stock: 22,
    image: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=600&q=80',
  },

  // ── Sports ───────────────────────────────────────────────────
  {
    name: 'Yoga Mat — 6mm Natural Rubber',
    description: 'Eco-friendly natural rubber mat with a microfibre top layer for supreme grip even in hot yoga. 183×68cm, 6mm thick, includes carry strap. Non-toxic, PVC-free.',
    price: 3299,
    category: 'Sports',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80',
  },
  {
    name: 'Adjustable Kettlebell 8–24kg',
    description: 'Replace 6 kettlebells in one compact unit. Fast and safe weight adjustment in 2kg increments. Cast iron core, rubber-coated plates, and a contoured handle for superior grip.',
    price: 8499,
    category: 'Sports',
    stock: 14,
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80',
  },

  // ── Other ────────────────────────────────────────────────────
  {
    name: 'Leather Passport Wallet',
    description: 'Full-grain vegetable-tanned leather passport holder. Ages beautifully with use. Holds passport, 4 cards, and boarding passes. Monogramming available.',
    price: 1599,
    category: 'Other',
    stock: 33,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    await Product.deleteMany({})
    console.log('🗑️  Cleared existing products')

    const inserted = await Product.insertMany(products)
    console.log(`🌱 Seeded ${inserted.length} products successfully`)

    console.log('\nProducts added:')
    inserted.forEach(p => console.log(`  • [${p.category.padEnd(11)}] ${p.name}  —  ₹${p.price.toLocaleString('en-IN')}`))

    await mongoose.disconnect()
    console.log('\n✅ Done. Database connection closed.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err.message)
    process.exit(1)
  }
}

seed()
