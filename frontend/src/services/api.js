const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://vishal-ecom-nohn.onrender.com/api';

// Debug logging
console.log('🔍 API Configuration:');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Backend Status: ✅ Running at https://vishal-ecom-nohn.onrender.com/');

export const searchAPI = {
  // Get all products
  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/search/all-products`);
    return response.json();
  },

  // Search products
  smartSearch: async (query) => {
    const response = await fetch(`${API_BASE_URL}/search/smart-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    return response.json();
  },
};
