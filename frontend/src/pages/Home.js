import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import { searchAPI } from '../services/api';
import './Home.css';

const Home = ({ onProductClick }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all products when component mounts
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await searchAPI.getAllProducts();
      setProducts(response.results);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const response = await searchAPI.smartSearch(query);
      setProducts(response.results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="container">
        <br></br>
        <SearchBar onSearch={handleSearch} />
        <ProductList products={products} loading={loading} onProductClick={onProductClick} />
      </div>
    </div>
  );
};

export default Home;
