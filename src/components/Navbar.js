/**
 * Navbar Component
 * Navigation bar with theme toggle
 */

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LiquidThemeToggle from './LiquidThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const isHomePage = location.pathname === '/';

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📅</span>
          SmartEvent
        </Link>

        <div className="navbar-right">
          <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className="fas fa-bars"></i>
          </div>
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          {!isAdmin && !isHomePage && (
            <li className="nav-item">
              <Link to="/events" className="nav-links">
                Browse Events
              </Link>
            </li>
          )}

          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <li className="nav-item">
                  <Link to="/my-bookings" className="nav-links">
                    My Bookings
                  </Link>
                </li>
              )}
              {!isAdmin && (
                <li className="nav-item">
                  <Link to="/wishlist" className="nav-links">
                    Wishlist
                  </Link>
                </li>
              )}

              {!isAdmin && (
                <li className="nav-item">
                  <Link to="/reviews" className="nav-links">
                    My Reviews
                  </Link>
                </li>
              )}

              {isAdmin && (
                <>
                  <li className="nav-item">
                    <Link to="/admin/dashboard" className="nav-links">
                      Admin Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/create-event" className="nav-links">
                      Create Event
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin/manage-events" className="nav-links">
                      Manage Events
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item nav-user">
                <span className="user-name">Hi, {user?.fullName}</span>
                <Link to="/profile" className="nav-links">
                  Profile
                </Link>
              </li>

              <li className="nav-item">
                <button className="nav-links logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links register-link">
                  Register
                </Link>
              </li>
            </>
          )}

          {/* Theme Toggle - Always Visible */}
          <li className="nav-item nav-theme-toggle">
            <LiquidThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
