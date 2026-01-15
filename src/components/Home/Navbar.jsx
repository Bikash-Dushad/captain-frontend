import React from 'react';
import { Home, Bell, User, Navigation } from 'lucide-react';

const Navbar = ({ isOnline }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <button className="nav-item active">
            <Home className="icon" />
            <span>Home</span>
          </button>
          <button className="nav-item">
            <Navigation className="icon" />
            <span>Total Rides: 0</span>
          </button>
          <button className="nav-item">
            <Bell className="icon" />
            <span>Notifications</span>
          </button>
        </div>
        <button className="nav-item">
          <User className="icon" />
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;