const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config({ path: './config.env' });

const sampleProducts = [
  // Electronics
  {
    name: "Apple MacBook Pro 14-inch",
    description: "Powerful laptop with M2 chip, perfect for professionals and students. Features long battery life and stunning display.",
    category: "electronics",
    subcategory: "laptop",
    price: 1999,
    brand: "Apple",
    features: ["powerful", "lightweight", "long-battery", "high-performance", "retina-display"],
    useCases: ["work", "study", "programming", "design", "video-editing"],
    occasions: ["professional", "education", "creative-work"],
    targetAudience: ["professionals", "students", "developers", "designers"],
    searchKeywords: ["macbook", "laptop", "apple", "professional", "student", "m2", "powerful"],
    inStock: true,
    rating: 4.8,
    reviewCount: 1250,
    imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop"
  },
  {
    name: "Sony WH-1000XM4 Wireless Headphones",
    description: "Industry-leading noise canceling wireless headphones with 30-hour battery life. Perfect for travel and work.",
    category: "electronics",
    subcategory: "headphones",
    price: 349,
    brand: "Sony",
    features: ["wireless", "noise-canceling", "long-battery", "comfortable", "high-quality-audio"],
    useCases: ["music", "travel", "work", "calls", "commuting"],
    occasions: ["daily", "travel", "office", "gym"],
    targetAudience: ["music-lovers", "professionals", "travelers"],
    searchKeywords: ["sony", "headphones", "wireless", "noise-canceling", "travel", "work"],
    inStock: true,
    rating: 4.7,
    reviewCount: 2100,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium smartphone with advanced camera system and S Pen. Perfect for photography and productivity.",
    category: "electronics",
    subcategory: "smartphone",
    price: 1199,
    brand: "Samsung",
    features: ["advanced-camera", "s-pen", "large-screen", "fast-charging", "premium"],
    useCases: ["photography", "productivity", "gaming", "communication"],
    occasions: ["daily", "professional", "travel"],
    targetAudience: ["tech-enthusiasts", "photographers", "professionals"],
    searchKeywords: ["samsung", "galaxy", "smartphone", "camera", "s-pen", "premium"],
    inStock: true,
    rating: 4.6,
    reviewCount: 890,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop"
  },

  // Footwear
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with max air cushioning technology. Perfect for daily runs and casual wear.",
    category: "footwear",
    subcategory: "running-shoes",
    price: 150,
    brand: "Nike",
    features: ["comfortable", "cushioning", "breathable", "lightweight", "durable"],
    useCases: ["running", "gym", "casual", "daily-wear", "exercise"],
    occasions: ["sports", "daily", "casual", "fitness"],
    targetAudience: ["men", "women", "athletes", "fitness-enthusiasts"],
    searchKeywords: ["nike", "air", "max", "running", "shoes", "comfortable", "cushioning"],
    inStock: true,
    rating: 4.5,
    reviewCount: 3200,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Premium running shoes with responsive cushioning and energy return. Ideal for serious runners.",
    category: "footwear",
    subcategory: "running-shoes",
    price: 180,
    brand: "Adidas",
    features: ["responsive", "energy-return", "comfortable", "breathable", "premium"],
    useCases: ["running", "marathon", "training", "fitness"],
    occasions: ["sports", "competition", "training"],
    targetAudience: ["runners", "athletes", "fitness-enthusiasts"],
    searchKeywords: ["adidas", "ultraboost", "running", "premium", "marathon", "training"],
    inStock: true,
    rating: 4.6,
    reviewCount: 1800,
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop"
  },
  {
    name: "Dr. Martens 1460 Boots",
    description: "Classic leather boots with air-cushioned sole. Perfect for work and casual wear with timeless style.",
    category: "footwear",
    subcategory: "boots",
    price: 170,
    brand: "Dr. Martens",
    features: ["leather", "durable", "comfortable", "classic", "air-cushioned"],
    useCases: ["work", "casual", "fashion", "daily-wear"],
    occasions: ["work", "casual", "fashion", "daily"],
    targetAudience: ["men", "women", "fashion-conscious", "workers"],
    searchKeywords: ["dr-martens", "boots", "leather", "work", "classic", "durable"],
    inStock: true,
    rating: 4.4,
    reviewCount: 950,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop"
  },

  // Clothing
  {
    name: "Elegant Red Party Dress",
    description: "Stunning red cocktail dress perfect for parties, weddings, and special occasions. Made with premium fabric.",
    category: "clothing",
    subcategory: "dress",
    price: 89,
    brand: "Fashion Co",
    features: ["red", "elegant", "party-wear", "premium-fabric", "stylish"],
    useCases: ["party", "events", "formal", "date-night"],
    occasions: ["party", "wedding", "dinner", "formal-events"],
    targetAudience: ["women"],
    searchKeywords: ["red", "dress", "party", "elegant", "formal", "wedding", "cocktail"],
    inStock: true,
    rating: 4.3,
    reviewCount: 420,
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop"
  },
  {
    name: "Men's Business Casual Shirt",
    description: "Professional button-down shirt perfect for office wear. Wrinkle-resistant and comfortable fit.",
    category: "clothing",
    subcategory: "shirt",
    price: 45,
    brand: "Professional Wear",
    features: ["wrinkle-resistant", "comfortable", "professional", "cotton", "classic-fit"],
    useCases: ["office", "work", "business", "professional"],
    occasions: ["work", "business-meetings", "professional"],
    targetAudience: ["men", "professionals"],
    searchKeywords: ["shirt", "business", "office", "professional", "work", "men", "casual"],
    inStock: true,
    rating: 4.2,
    reviewCount: 680,
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop"
  },
  {
    name: "Cozy Winter Sweater",
    description: "Warm and comfortable wool blend sweater perfect for cold weather. Available in multiple colors.",
    category: "clothing",
    subcategory: "sweater",
    price: 65,
    brand: "Comfort Wear",
    features: ["warm", "comfortable", "wool-blend", "cozy", "soft"],
    useCases: ["winter", "casual", "warmth", "comfort"],
    occasions: ["winter", "casual", "daily", "cold-weather"],
    targetAudience: ["men", "women"],
    searchKeywords: ["sweater", "winter", "warm", "cozy", "wool", "comfortable"],
    inStock: true,
    rating: 4.5,
    reviewCount: 320,
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop"
  },

  // Home & Living
  {
    name: "Smart Home Security Camera",
    description: "WiFi-enabled security camera with night vision and mobile app control. Perfect for home monitoring.",
    category: "home",
    subcategory: "security",
    price: 129,
    brand: "SecureHome",
    features: ["wifi", "night-vision", "mobile-app", "smart", "hd-video"],
    useCases: ["security", "monitoring", "home-protection", "surveillance"],
    occasions: ["home", "security", "peace-of-mind"],
    targetAudience: ["homeowners", "families", "security-conscious"],
    searchKeywords: ["security", "camera", "home", "smart", "wifi", "monitoring"],
    inStock: true,
    rating: 4.4,
    reviewCount: 780,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
  },
  {
    name: "Ergonomic Office Chair",
    description: "Comfortable office chair with lumbar support and adjustable height. Perfect for long work hours.",
    category: "home",
    subcategory: "furniture",
    price: 299,
    brand: "OfficeComfort",
    features: ["ergonomic", "lumbar-support", "adjustable", "comfortable", "breathable"],
    useCases: ["office", "work", "study", "computer-work"],
    occasions: ["work", "study", "home-office"],
    targetAudience: ["professionals", "students", "remote-workers"],
    searchKeywords: ["office", "chair", "ergonomic", "comfortable", "work", "lumbar"],
    inStock: true,
    rating: 4.6,
    reviewCount: 1100,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
  },
  {
    name: "Premium Coffee Maker",
    description: "Programmable coffee maker with thermal carafe. Brews perfect coffee every morning.",
    category: "home",
    subcategory: "appliances",
    price: 159,
    brand: "BrewMaster",
    features: ["programmable", "thermal-carafe", "automatic", "premium", "easy-to-use"],
    useCases: ["coffee", "morning", "kitchen", "brewing"],
    occasions: ["daily", "morning", "home"],
    targetAudience: ["coffee-lovers", "homeowners"],
    searchKeywords: ["coffee", "maker", "programmable", "thermal", "brewing", "kitchen"],
    inStock: true,
    rating: 4.3,
    reviewCount: 650,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
  },

  // Sports & Fitness
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat with extra cushioning. Perfect for yoga, pilates, and home workouts.",
    category: "sports",
    subcategory: "fitness",
    price: 39,
    brand: "YogaLife",
    features: ["non-slip", "cushioned", "durable", "lightweight", "eco-friendly"],
    useCases: ["yoga", "pilates", "exercise", "meditation", "stretching"],
    occasions: ["fitness", "home-workout", "gym", "meditation"],
    targetAudience: ["yoga-enthusiasts", "fitness-lovers", "women", "men"],
    searchKeywords: ["yoga", "mat", "fitness", "exercise", "pilates", "workout"],
    inStock: true,
    rating: 4.7,
    reviewCount: 890,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
  },
  {
    name: "Wireless Fitness Tracker",
    description: "Advanced fitness tracker with heart rate monitoring and sleep tracking. Perfect for health-conscious individuals.",
    category: "sports",
    subcategory: "wearables",
    price: 199,
    brand: "FitTrack",
    features: ["heart-rate", "sleep-tracking", "waterproof", "long-battery", "smart-notifications"],
    useCases: ["fitness", "health", "running", "swimming", "daily-tracking"],
    occasions: ["daily", "fitness", "sports", "health-monitoring"],
    targetAudience: ["fitness-enthusiasts", "health-conscious", "athletes"],
    searchKeywords: ["fitness", "tracker", "heart-rate", "health", "smart", "waterproof"],
    inStock: true,
    rating: 4.5,
    reviewCount: 1200,
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop"
  },
  {
    name: "Professional Tennis Racket",
    description: "High-performance tennis racket used by professionals. Lightweight with excellent control and power.",
    category: "sports",
    subcategory: "tennis",
    price: 249,
    brand: "ProTennis",
    features: ["professional", "lightweight", "control", "power", "carbon-fiber"],
    useCases: ["tennis", "competition", "training", "sports"],
    occasions: ["sports", "competition", "training"],
    targetAudience: ["tennis-players", "athletes", "sports-enthusiasts"],
    searchKeywords: ["tennis", "racket", "professional", "sports", "competition", "training"],
    inStock: true,
    rating: 4.8,
    reviewCount: 340,
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop"
  },

  // Beauty & Personal Care
  {
    name: "Organic Face Moisturizer",
    description: "Natural organic moisturizer for sensitive skin. Hydrating and anti-aging properties with SPF protection.",
    category: "beauty",
    subcategory: "skincare",
    price: 49,
    brand: "NaturalGlow",
    features: ["organic", "sensitive-skin", "hydrating", "anti-aging", "spf-protection"],
    useCases: ["skincare", "daily-care", "anti-aging", "protection"],
    occasions: ["daily", "skincare-routine"],
    targetAudience: ["women", "men", "sensitive-skin", "anti-aging"],
    searchKeywords: ["moisturizer", "organic", "sensitive", "skin", "anti-aging", "natural"],
    inStock: true,
    rating: 4.6,
    reviewCount: 520,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop"
  },
  {
    name: "Professional Hair Dryer",
    description: "Salon-quality hair dryer with ionic technology. Fast drying with minimal heat damage.",
    category: "beauty",
    subcategory: "hair-care",
    price: 89,
    brand: "SalonPro",
    features: ["professional", "ionic-technology", "fast-drying", "heat-protection", "lightweight"],
    useCases: ["hair-styling", "daily-grooming", "professional-styling"],
    occasions: ["daily", "styling", "professional"],
    targetAudience: ["women", "men", "hair-stylists"],
    searchKeywords: ["hair", "dryer", "professional", "ionic", "salon", "styling"],
    inStock: true,
    rating: 4.4,
    reviewCount: 410,
    imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=300&fit=crop"
  },

  // Books & Education
  {
    name: "Learn Python Programming - Complete Guide",
    description: "Comprehensive Python programming book for beginners to advanced. Includes practical projects and exercises.",
    category: "books",
    subcategory: "programming",
    price: 29,
    brand: "TechBooks",
    features: ["comprehensive", "beginner-friendly", "practical", "exercises", "projects"],
    useCases: ["learning", "programming", "skill-development", "education"],
    occasions: ["study", "learning", "career-development"],
    targetAudience: ["students", "programmers", "beginners", "developers"],
    searchKeywords: ["python", "programming", "book", "learn", "coding", "development"],
    inStock: true,
    rating: 4.7,
    reviewCount: 680,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
  },
  {
    name: "Digital Marketing Masterclass",
    description: "Complete guide to digital marketing strategies including SEO, social media, and content marketing.",
    category: "books",
    subcategory: "business",
    price: 35,
    brand: "BusinessGurus",
    features: ["comprehensive", "practical", "up-to-date", "case-studies", "actionable"],
    useCases: ["marketing", "business", "skill-development", "career"],
    occasions: ["learning", "professional-development"],
    targetAudience: ["marketers", "entrepreneurs", "business-owners", "students"],
    searchKeywords: ["digital", "marketing", "business", "seo", "social-media", "guide"],
    inStock: true,
    rating: 4.5,
    reviewCount: 290,
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
  },

  // Kitchen & Dining
  {
    name: "Stainless Steel Cookware Set",
    description: "Professional-grade 10-piece cookware set. Non-stick coating and dishwasher safe.",
    category: "home",
    subcategory: "kitchen",
    price: 199,
    brand: "ChefMaster",
    features: ["stainless-steel", "non-stick", "dishwasher-safe", "professional-grade", "durable"],
    useCases: ["cooking", "kitchen", "meal-preparation", "professional-cooking"],
    occasions: ["daily-cooking", "meal-prep", "entertaining"],
    targetAudience: ["home-cooks", "professional-chefs", "cooking-enthusiasts"],
    searchKeywords: ["cookware", "stainless", "steel", "kitchen", "cooking", "professional"],
    inStock: true,
    rating: 4.6,
    reviewCount: 750,
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Clear existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`🗑️ Cleared ${deleteResult.deletedCount} existing products`);
    
    // Insert sample products
    const insertResult = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully inserted ${insertResult.length} products`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('📊 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleProducts, seedDatabase };
