import React from 'react';
import './Header.css';

const Header = ({ user, onLogout, onShowProfile }) => {
  return (
    <header className="header">
      <div className="container">
        <h1>VShop</h1>
        
        {user && (
          <div className="user-info">
            <span className="welcome-text">Welcome, {user.username}!</span>
            <button onClick={onShowProfile} className="profile-button">
              Profile
            </button>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
