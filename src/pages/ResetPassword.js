/**
 * Reset Password Page
 * Users set their new password after verifying OTP
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Auth.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get email and reset token from localStorage
    const storedEmail = localStorage.getItem('resetEmail');
    const storedToken = localStorage.getItem('resetToken');

    if (!storedEmail || !storedToken) {
      navigate('/forgot-password');
      return;
    }

    setEmail(storedEmail);
    setResetToken(storedToken);
  }, [navigate]);

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length check
    if (newPassword.length >= 8) strength += 1;
    if (newPassword.length >= 12) strength += 1;

    // Character variety checks
    if (/[a-z]/.test(newPassword)) strength += 1; // lowercase
    if (/[A-Z]/.test(newPassword)) strength += 1; // uppercase
    if (/[0-9]/.test(newPassword)) strength += 1; // numbers
    if (/[!@#$%^&*]/.test(newPassword)) strength += 1; // special chars

    setPasswordStrength(Math.min(strength, 5));
  }, [newPassword]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return '#ccc';
    if (passwordStrength <= 2) return '#e74c3c'; // Red - Weak
    if (passwordStrength <= 3) return '#f39c12'; // Orange - Fair
    if (passwordStrength <= 4) return '#2ecc71'; // Green - Good
    return '#27ae60'; // Dark Green - Strong
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please provide both passwords');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 2) {
      setError('Password is too weak. Please use a stronger password.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(email, resetToken, newPassword, confirmPassword);
      
      // Clear localStorage
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetToken');
      
      // Show success message and redirect to login
      navigate('/login', {
        state: {
          message: 'Password reset successful. Please login with your new password.',
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Set New Password</h2>
          <p className="auth-subtitle">Create a strong new password for your account</p>

          <div className="trust-signal">
            Your password will be securely encrypted
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    />
                  </div>
                  <p
                    className="strength-text"
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    Strength: {getPasswordStrengthText()}
                  </p>
                </div>
              )}

              <p className="form-hint">
                Use at least 8 characters with uppercase, lowercase, numbers, and special characters
              </p>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              {confirmPassword && newPassword === confirmPassword && (
                <p className="match-success">✓ Passwords match</p>
              )}
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="match-error">✕ Passwords do not match</p>
              )}
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
