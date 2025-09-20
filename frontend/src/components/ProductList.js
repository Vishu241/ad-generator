import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = ({ products, loading, onProductClick }) => {
  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return <div className="no-products">No products found</div>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onClick={onProductClick} />
      ))}
    </div>
  );
};

export default ProductList;
