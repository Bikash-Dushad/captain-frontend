import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">Captain App</h1>
      </div>
      
      <div className="navbar-center">
        <button className="nav-item active">Home</button>
        <button className="nav-item">My Rides</button>
        <button className="nav-item">Notifications</button>
        <button className="nav-item">Profile</button>
      </div>
      
      <div className="navbar-right">
        <button className="profile-btn">
          <div className="profile-avatar">C</div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;