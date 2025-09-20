import React, { useState } from 'react';
import { userService } from '../services/userService';
import './ProductDetail.css';

const ProductDetail = ({ product, onBack, user, onUserUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check if product is in cart or favorites
  const isInCart = user && userService.isInCart(product._id, user);
  const isInFavorites = user && userService.isInFavorites(product._id, user);

  const showMessage = (msg) => {
    setMessage(msg);
    // Clear message after 2 seconds
    setTimeout(() => setMessage(''), 2000);
  };

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      const updatedUser = await userService.addToCart(product._id);
      onUserUpdate(updatedUser);
      showMessage('Added to cart!');
    } catch (error) {
      showMessage('Error adding to cart');
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      if (isInCart) {
        const updatedUser = await userService.removeFromCart(product._id);
        onUserUpdate(updatedUser);
        showMessage('Removed from cart');
      } else {
        const updatedUser = await userService.addToCart(product._id);
        onUserUpdate(updatedUser);
        showMessage('Added to cart!');
      }
    } catch (error) {
      showMessage('Error');
    }
    setLoading(false);
  };

  const handleToggleFavorite = async () => {
    setLoading(true);
    try {
      if (isInFavorites) {
        const updatedUser = await userService.removeFromFavorites(product._id);
        onUserUpdate(updatedUser);
        showMessage('Removed from favorites');
      } else {
        const updatedUser = await userService.addToFavorites(product._id);
        onUserUpdate(updatedUser);
        showMessage('Added to favorites!');
      }
    } catch (error) {
      showMessage('Error');
    }
    setLoading(false);
  };

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container">
          <button onClick={onBack} className="back-button">
            ← Back to Products
          </button>
          <div className="no-product">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={onBack} className="back-button">
          ← Back to Products
        </button>
        
        <div className="product-detail-content">
          <div className="product-image-large">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="placeholder-image-large">
                <span>📦</span>
              </div>
            )}
          </div>
          
          <div className="product-info-detailed">
            <h1 className="product-title">{product.name}</h1>
            
            {product.brand && (
              <p className="product-brand">Brand: {product.brand}</p>
            )}
            
            <div className="product-price-large">
              ₹{product.price}
            </div>
            
            <div className="product-description-full">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            {product.features && product.features.length > 0 && (
              <div className="product-features-list">
                <h3>Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="product-actions">
              <button 
                onClick={handleBuyNow} 
                className="buy-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Buy Now'}
              </button>
              <button 
                onClick={handleAddToCart} 
                className={`cart-button ${isInCart ? 'in-cart' : ''}`}
                disabled={loading}
              >
                {isInCart ? 'In Cart ✓' : 'Add to Cart'}
              </button>
              <button 
                onClick={handleToggleFavorite} 
                className={`favorite-button ${isInFavorites ? 'favorited' : ''}`}
                disabled={loading}
              >
                {isInFavorites ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </button>
            </div>
            
            {message && (
              <div className={`action-message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
