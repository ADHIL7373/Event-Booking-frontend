/**
 * Forgot Password Page
 * Users enter their email to request a password reset OTP
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      
      setSuccess(true);
      // Store email for next step
      localStorage.setItem('resetEmail', email);
      
      // Redirect to OTP verification page after 2 seconds
      setTimeout(() => {
        navigate('/verify-otp');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="success-message-container">
              <div className="success-icon">✓</div>
              <h2>OTP Sent Successfully</h2>
              <p>We've sent a 6-digit OTP to your email address.</p>
              <p className="email-info">Email: {email}</p>
              <p className="otp-info">OTP expires in 10 minutes</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Forgot Password</h2>
          <p className="auth-subtitle">Enter your email to receive a password reset OTP</p>

          <div className="trust-signal">
            Your email is secure
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <p className="auth-footer">
            Remember your password? <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
