const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    lowercase: true
  },
  subcategory: {
    type: String,
    lowercase: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  brand: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // Enhanced fields for NLP search
  features: {
    type: [String],
    default: []
  },
  useCases: {
    type: [String],
    default: []
  },
  occasions: {
    type: [String],
    default: []
  },
  targetAudience: {
    type: [String],
    default: []
  },
  searchKeywords: {
    type: [String],
    default: []
  },
  
  // Additional product info
  inStock: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    min: 0,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true 
});

// Create text index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  features: 'text',
  searchKeywords: 'text',
  brand: 'text'
});

// Index for category and price filtering
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
