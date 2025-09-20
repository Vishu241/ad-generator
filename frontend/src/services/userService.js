// User service with MongoDB backend and localStorage session
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const USER_ID_KEY = 'smartshop_user_id';

// Store only user ID in localStorage
const saveUserId = (userId) => {
  localStorage.setItem(USER_ID_KEY, userId);
};

// Get user ID from localStorage
const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY);
};

// Remove user ID (logout)
const removeUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
};

// Get user data from backend
const getCurrentUser = async () => {
  const userId = getUserId();
  if (!userId) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`);
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const userService = {
  // Register new user
  register: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error);
    }

    saveUserId(data.user.id);
    return data.user;
  },

  // Login user
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error);
    }

    saveUserId(data.user.id);
    return data.user;
  },

  // Logout user
  logout: () => {
    removeUserId();
  },

  // Get current user
  getCurrentUser,

  // Add to cart
  addToCart: async (productId) => {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/auth/cart/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    const data = await response.json();
    return data.user;
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/auth/cart/${userId}/${productId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data.user;
  },

  // Add to favorites
  addToFavorites: async (productId) => {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/auth/favorites/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    const data = await response.json();
    return data.user;
  },

  // Remove from favorites
  removeFromFavorites: async (productId) => {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/auth/favorites/${userId}/${productId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data.user;
  },

  // Check if item is in cart (synchronous helper)
  isInCart: (productId, user) => {
    return user ? user.cart.includes(productId) : false;
  },

  // Check if item is in favorites (synchronous helper)
  isInFavorites: (productId, user) => {
    return user ? user.favorites.includes(productId) : false;
  }
};
