const { GoogleGenerativeAI } = require('@google/generative-ai');

class NLPService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async parseQuery(userQuery) {
    const prompt = `
      You are an e-commerce search query analyzer. Analyze the following search query and extract structured information.
      
      Query: "${userQuery}"
      
      Extract and return ONLY valid JSON in this exact format (no extra text):
      {
        "category": "main product category (electronics, clothing, footwear, home, books, sports, beauty, etc.) or empty string",
        "subcategory": "specific subcategory if mentioned or empty string",
        "features": ["array of product features mentioned like comfortable, waterproof, wireless, etc."],
        "priceRange": {"min": 0, "max": 0},
        "brand": "specific brand name mentioned or empty string",
        "useCases": ["how the product will be used like running, work, gaming, etc."],
        "occasions": ["when it will be used like party, wedding, gym, office, etc."],
        "targetAudience": ["who it's for like men, women, kids, professionals, etc."],
        "keywords": ["important search terms from the query"],
        "intent": "buy"
      }
      
      Examples:
      Query: "comfortable running shoes under $100"
      Response: {"category": "footwear", "subcategory": "running-shoes", "features": ["comfortable"], "priceRange": {"min": 0, "max": 100}, "brand": "", "useCases": ["running"], "occasions": ["sports"], "targetAudience": [], "keywords": ["comfortable", "running", "shoes"], "intent": "buy"}
      
      Query: "red dress for wedding party"
      Response: {"category": "clothing", "subcategory": "dress", "features": ["red"], "priceRange": {"min": 0, "max": 0}, "brand": "", "useCases": ["party"], "occasions": ["wedding", "party"], "targetAudience": ["women"], "keywords": ["red", "dress", "wedding", "party"], "intent": "buy"}
      
      Query: "macbook for college student"
      Response: {"category": "electronics", "subcategory": "laptop", "features": [], "priceRange": {"min": 0, "max": 0}, "brand": "apple", "useCases": ["study", "college"], "occasions": ["education"], "targetAudience": ["students"], "keywords": ["macbook", "college", "student"], "intent": "buy"}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      let response = result.response.text().trim();
      
      // Clean response to extract JSON
      response = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Remove any extra text before or after JSON
      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        response = response.substring(jsonStart, jsonEnd);
      }
      
      const parsed = JSON.parse(response);
      
      // Validate and clean the parsed data
      return this.validateParsedQuery(parsed);
      
    } catch (error) {
      console.error('NLP parsing error:', error);
      console.log('Falling back to basic parsing...');
      return this.fallbackParse(userQuery);
    }
  }

  validateParsedQuery(parsed) {
    return {
      category: parsed.category || "",
      subcategory: parsed.subcategory || "",
      features: Array.isArray(parsed.features) ? parsed.features : [],
      priceRange: {
        min: parsed.priceRange?.min || 0,
        max: parsed.priceRange?.max || 0
      },
      brand: parsed.brand || "",
      useCases: Array.isArray(parsed.useCases) ? parsed.useCases : [],
      occasions: Array.isArray(parsed.occasions) ? parsed.occasions : [],
      targetAudience: Array.isArray(parsed.targetAudience) ? parsed.targetAudience : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      intent: parsed.intent || "buy"
    };
  }

  fallbackParse(query) {
    const words = query.toLowerCase().split(' ').filter(word => word.length > 2);
    
    // Basic price extraction
    const priceMatch = query.match(/under\s+\$?(\d+)|below\s+\$?(\d+)|\$(\d+)/i);
    const maxPrice = priceMatch ? parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]) : 0;
    
    // Basic brand detection
    const commonBrands = ['nike', 'adidas', 'apple', 'samsung', 'sony', 'hp', 'dell', 'zara', 'h&m'];
    const detectedBrand = commonBrands.find(brand => query.toLowerCase().includes(brand)) || "";
    
    return {
      category: "",
      subcategory: "",
      features: words.filter(word => !['for', 'the', 'and', 'with', 'under', 'below'].includes(word)),
      priceRange: { min: 0, max: maxPrice },
      brand: detectedBrand,
      useCases: [],
      occasions: [],
      targetAudience: [],
      keywords: words,
      intent: "buy"
    };
  }
}

module.exports = new NLPService();
