import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="placeholder-image">
            <span>📦</span>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          ₹{product.price}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
