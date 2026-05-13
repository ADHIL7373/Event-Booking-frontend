/**
 * Home Page
 * Landing page of the application
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Discover & Book Amazing Events</h1>
          <p>Find the best events near you and book tickets instantly with QR codes</p>
          <div className="hero-buttons">
            <Link to="/events" className="btn btn-primary">
              Explore Events
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-secondary">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose SmartEvent?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon booking">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                <path d="M16 2v4M8 2v4M3 10h18"></path>
              </svg>
            </div>
            <h3>Easy Booking</h3>
            <p>Book tickets in just a few clicks with our user-friendly interface</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon qrcode">
              <svg viewBox="0 0 24 24" fill="white">
                <rect x="2" y="2" width="8" height="8"></rect>
                <rect x="14" y="2" width="8" height="8"></rect>
                <rect x="2" y="14" width="8" height="8"></rect>
                <path d="M14 14h2v2h-2v-2M18 14h2v2h-2v-2M14 18h2v2h-2v-2M18 18h2v2h-2v-2M14 16h4M16 14v4" fill="none" stroke="white" strokeWidth="1"></path>
              </svg>
            </div>
            <h3>QR Code Tickets</h3>
            <p>Get instant QR code tickets for hassle-free entry</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon payment">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"></path>
              </svg>
            </div>
            <h3>Secure Payments</h3>
            <p>Your transactions are safe and secure with us</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon dashboard">
              <svg viewBox="0 0 24 24" fill="white">
                <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z"></path>
              </svg>
            </div>
            <h3>Smart Dashboard</h3>
            <p>Track your bookings and manage events easily</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Book Your Next Event?</h2>
        <Link to="/events" className="btn btn-large">
          Browse Events Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
