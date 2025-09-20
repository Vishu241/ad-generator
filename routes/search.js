const express = require('express');
const Product = require('../models/Product');
const nlpService = require('../services/nlp');

const router = express.Router();

// Smart search endpoint
router.post('/smart-search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ 
        error: 'Search query is required',
        example: 'Try: "comfortable running shoes under $100"'
      });
    }

    console.log(`🔍 Processing search query: "${query}"`);

    // Parse query with Gemini AI
    const parsedQuery = await nlpService.parseQuery(query);
    console.log('📝 Parsed query:', JSON.stringify(parsedQuery, null, 2));
    
    // Build MongoDB query
    const mongoQuery = buildSearchQuery(parsedQuery);
    console.log('🗄️ MongoDB query:', JSON.stringify(mongoQuery, (key, value) => {
      if (value instanceof RegExp) {
        return value.toString();
      }
      return value;
    }, 2));
    
    // Execute search with sorting
    const products = await Product.find(mongoQuery)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(20);
    
    console.log(`✅ Found ${products.length} products`);
    
    res.json({
      success: true,
      originalQuery: query,
      parsedQuery,
      mongoQuery,
      results: products,
      count: products.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Search failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all products (for testing)
router.get('/all-products', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ name: 1 });
    res.json({
      success: true,
      results: products,
      count: products.length
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// Search by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ 
      category: new RegExp(category, 'i') 
    }).sort({ rating: -1 }).limit(20);
    
    res.json({
      success: true,
      category,
      results: products,
      count: products.length
    });
  } catch (error) {
    console.error('❌ Category search error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Category search failed'
    });
  }
});

// Build MongoDB query from parsed NLP data
function buildSearchQuery(parsed) {
  let query = {};
  let conditions = [];
  
  // Category and Subcategory matching
  if (parsed.category || parsed.subcategory) {
    let categoryConditions = [];
    
    // Match main category if provided
    if (parsed.category) {
      const categoryPattern = parsed.category.replace(/\s+/g, '[-\\s]');
      categoryConditions.push({ category: new RegExp(categoryPattern, 'i') });
    }
    
    // Match subcategory (prefer specific subcategory over category)
    const subcategoryToMatch = parsed.subcategory || parsed.category;
    if (subcategoryToMatch) {
      const subcategoryPattern = subcategoryToMatch.replace(/\s+/g, '[-\\s]');
      categoryConditions.push({ subcategory: new RegExp(subcategoryPattern, 'i') });
    }
    
    // Use OR logic: match either category OR subcategory
    if (categoryConditions.length > 0) {
      conditions.push({
        $or: categoryConditions
      });
    }
  }
  
  // Features matching
  if (parsed.features && parsed.features.length > 0) {
    conditions.push({
      features: { 
        $in: parsed.features.map(feature => new RegExp(feature, 'i'))
      }
    });
  }
  
  // Price range filtering
  if (parsed.priceRange && parsed.priceRange.max > 0) {
    query.price = {
      $gte: parsed.priceRange.min || 0,
      $lte: parsed.priceRange.max
    };
  }
  
  // Brand matching (exact match preferred)
  if (parsed.brand) {
    conditions.push({
      brand: new RegExp(parsed.brand, 'i')
    });
  }
  
  // Use cases matching
  if (parsed.useCases && parsed.useCases.length > 0) {
    conditions.push({
      useCases: { 
        $in: parsed.useCases.map(useCase => new RegExp(useCase, 'i'))
      }
    });
  }
  
  // Occasions matching
  if (parsed.occasions && parsed.occasions.length > 0) {
    conditions.push({
      occasions: { 
        $in: parsed.occasions.map(occasion => new RegExp(occasion, 'i'))
      }
    });
  }
  
  // Target audience matching
  if (parsed.targetAudience && parsed.targetAudience.length > 0) {
    conditions.push({
      targetAudience: { 
        $in: parsed.targetAudience.map(audience => new RegExp(audience, 'i'))
      }
    });
  }
  
  // Combine all conditions
  if (conditions.length > 0) {
    if (conditions.length === 1) {
      query = { ...query, ...conditions[0] };
    } else {
      query.$and = conditions;
    }
  } else if (parsed.keywords && parsed.keywords.length > 0) {
    // Fallback to text search when no specific conditions found
    query.$text = { 
      $search: parsed.keywords.join(' ')
    };
  }
  
  // Always show in-stock items first
  query.inStock = true;
  
  return query;
}

module.exports = router;
