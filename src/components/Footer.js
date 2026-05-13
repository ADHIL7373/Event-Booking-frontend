/**
 * Footer Component - Premium, Trust-Focused, Newsletter-Enabled
 */

import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    if (!isValidEmail(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Call backend subscription endpoint
      const response = await fetch('http://localhost:5000/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      // Success
      setMessage({
        type: 'success',
        text: '✅ Subscribed successfully! Check your email for confirmation.',
      });
      setEmail('');

      // Auto-clear message after 4 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 4000);
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Subscription failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = isValidEmail(email);

  return (
    <footer className="footer">
      {/* Trust Divider */}
      <div className="footer-trust-divider"></div>

      <div className="footer-container">
        {/* Brand & Trust Section */}
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">📅</span>
            <h3>SmartEvent</h3>
          </div>
          <p className="brand-tagline">
            Discover and book events with secure QR-based tickets
          </p>

          {/* Trust Indicators */}
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span className="trust-text">Secure payments</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span className="trust-text">Instant confirmation</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">📱</span>
              <span className="trust-text">Mobile tickets</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="social-links">
            <a href="https://www.facebook.com/share/1BPedKpBPh/" target="_blank" rel="noopener noreferrer" title="Facebook" aria-label="Facebook">
              <span>f</span>
            </a>
            <a href="https://www.instagram.com/demon__king_07?igsh=aWs2eHB4aXFtYzNk" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram">
              <span>📷</span>
            </a>
            <a href="https://www.linkedin.com/in/a-mohamed-adhil/" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
              <span>in</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/events">Browse Events</a></li>
            <li><a href="/my-bookings">My Bookings</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Support</a></li>
          </ul>
        </div>

        {/* Information */}
        <div className="footer-section footer-info">
          <h4>Information</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Security</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section footer-newsletter">
          <h4>Stay Updated</h4>
          <p className="newsletter-subtitle">
            Get event updates. No spam, unsubscribe anytime.
          </p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-input-group">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="newsletter-input"
              />
              <button
                type="submit"
                disabled={loading || !email}
                className="newsletter-button"
              >
                {loading ? '...' : 'Subscribe'}
              </button>
            </div>
            {message.text && (
              <div className={`newsletter-message newsletter-${message.type}`}>
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Footer Bottom - Trust & Copyright */}
      <div className="footer-bottom-divider"></div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © {currentYear} SmartEvent. All rights reserved.
          </p>
          <div className="trust-badge">
            ✓ Secure & Trusted Platform
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
