import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import UserProfile from './pages/UserProfile';
import Login from './components/Login';
import Signup from './components/Signup';
import { userService } from './services/userService';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'

  // Check if user is already logged in when app starts
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await userService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };
    checkUser();
  }, []);

  const showProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
  };

  const showHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setCurrentView('home');
  };

  const handleSignup = (newUser) => {
    setUser(newUser);
    setCurrentView('home');
  };

  const handleLogout = () => {
    userService.logout();
    setUser(null);
    setCurrentView('home');
  };

  const showProfile = () => {
    setCurrentView('profile');
  };

  // If user is not logged in, show auth forms
  if (!user) {
    return (
      <div className="App">
        <Header />
        {authView === 'login' ? (
          <Login 
            onLogin={handleLogin} 
            onSwitchToSignup={() => setAuthView('signup')} 
          />
        ) : (
          <Signup 
            onSignup={handleSignup} 
            onSwitchToLogin={() => setAuthView('login')} 
          />
        )}
      </div>
    );
  }

  // If user is logged in, show main app
  return (
    <div className="App">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onShowProfile={showProfile} 
      />
      {currentView === 'home' ? (
        <Home onProductClick={showProductDetail} />
      ) : currentView === 'product' ? (
        <ProductDetail 
          product={selectedProduct} 
          onBack={showHome} 
          user={user}
          onUserUpdate={setUser}
        />
      ) : (
        <UserProfile 
          user={user}
          onBack={showHome}
          onProductClick={showProductDetail}
        />
      )}
    </div>
  );
}

export default App;
