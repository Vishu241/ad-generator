import React, { useState, useEffect, useCallback } from 'react';
import { searchAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './UserProfile.css';

const UserProfile = ({ user, onBack, onProductClick }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [currentTab, setCurrentTab] = useState('cart');
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      // Get all products
      const response = await searchAPI.getAllProducts();
      const allProducts = response.results || [];

      // Find cart products
      const cartItems = allProducts.filter(product => 
        user.cart.includes(product._id)
      );

      // Find favorite products
      const favoriteItems = allProducts.filter(product => 
        user.favorites.includes(product._id)
      );

      setCartProducts(cartItems);
      setFavoriteProducts(favoriteItems);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  }, [user]);

  // Load products when component mounts
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return (
      <div className="user-profile">
        <div className="container">
          <button onClick={onBack} className="back-button">← Back to Home</button>
          <div className="loading">Loading your items...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="container">
        <button onClick={onBack} className="back-button">
          ← Back to Home
        </button>

        <div className="profile-info">
          <h1>Hello, {user.username}!</h1>
        </div>

        <div className="profile-tabs">
          <button 
            className={currentTab === 'cart' ? 'tab active' : 'tab'}
            onClick={() => setCurrentTab('cart')}
          >
            Cart ({cartProducts.length})
          </button>
          <button 
            className={currentTab === 'favorites' ? 'tab active' : 'tab'}
            onClick={() => setCurrentTab('favorites')}
          >
            Favorites ({favoriteProducts.length})
          </button>
        </div>

        <div className="tab-content">
          {currentTab === 'cart' ? (
            <div className="cart-section">
              <h2>Your Cart</h2>
              {cartProducts.length === 0 ? (
                <div className="empty-message">
                  <p>🛒 Your cart is empty</p>
                  <p>Add some products to see them here!</p>
                </div>
              ) : (
                <div className="products-grid">
                  {cartProducts.map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      onClick={onProductClick}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="favorites-section">
              <h2>Your Favorites</h2>
              {favoriteProducts.length === 0 ? (
                <div className="empty-message">
                  <p>❤️ No favorites yet</p>
                  <p>Mark products as favorites to see them here!</p>
                </div>
              ) : (
                <div className="products-grid">
                  {favoriteProducts.map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      onClick={onProductClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
