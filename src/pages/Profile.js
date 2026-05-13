/**
 * Profile Page - Modern SaaS Dashboard Style
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import './Profile.css';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
  });

  // Sync profile image when user updates (e.g., after login)
  useEffect(() => {
    if (user?.profileImage) {
      setFormData((prev) => ({
        ...prev,
        profileImage: user.profileImage,
      }));
    }
  }, [user?.profileImage]);
  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Add toast notification
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  // Remove toast
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // convert to base64 and immediately upload via profile update endpoint
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      setLoading(true);
      try {
        const result = await authService.updateProfile(
          formData.fullName || user?.fullName,
          formData.phone || user?.phone,
          base64
        );
        // update context user
        updateUserProfile(result.user);
        // reflect in local form state
        setFormData((prev) => ({ ...prev, profileImage: base64 }));
        addToast('Avatar uploaded successfully!', 'success');
      } catch (err) {
        addToast(err.message || 'Failed to upload avatar', 'error');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authService.updateProfile(
        formData.fullName,
        formData.phone
      );
      updateUserProfile(result.user);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.changePassword(
        password.oldPassword,
        password.newPassword,
        password.confirmPassword
      );
      addToast('Password changed successfully!', 'success');
      setPassword({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
    } catch (err) {
      addToast(err.message || 'Password change failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="profile-page">
      {/* Toast Notifications */}
      <div className="toasts-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-content">
              {toast.type === 'success' && <span className="toast-icon">✓</span>}
              {toast.type === 'error' && <span className="toast-icon">✕</span>}
              {toast.type === 'info' && <span className="toast-icon">ℹ</span>}
              <span className="toast-message">{toast.message}</span>
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="header-content">
            <h1>My Profile</h1>
            <p className="header-subtitle">Manage your account information and security settings</p>
          </div>
        </div>

        {/* Profile Avatar Section */}
        <div className="profile-card avatar-card">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <div className="avatar" style={{ backgroundColor: '#1e40af' }}>
                {formData.profileImage || user?.profileImage ? (
                  <img
                    src={formData.profileImage || user?.profileImage}
                    alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  getInitials(user?.fullName || 'User')
                )}
              </div>
              <label className="avatar-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
                <span className="upload-icon">📷</span>
              </label>
            </div>
            <div className="avatar-info">
              <h2>{user?.fullName}</h2>
              <p className="email-display">{user?.email}</p>
              <span className={`role-badge role-${user?.role}`}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="profile-grid">
          {/* Personal Information */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Personal Information</h3>
              <span className="card-icon">👤</span>
            </div>
            <form onSubmit={handleProfileSubmit} className="form-vertical">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Full Name</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">✎</span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Phone Number</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📞</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter your phone number"
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">💾</span>
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information - Apple Inspired */}
          <div className="contact-info-card">
            <div className="contact-info-header">
              <h3 className="contact-info-title">Contact Information</h3>
              <span className="contact-info-icon">ⓘ</span>
            </div>

            {/* Email Section */}
            <div className="contact-section">
              <label className="contact-label">Email Address</label>
              <div className="contact-email-display">
                <span className="email-lock-icon">🔒</span>
                <div className="email-content">
                  <span className="email-value">{user?.email}</span>
                </div>
              </div>
              <p className="contact-helper-text">This email cannot be changed</p>
            </div>

            {/* Divider */}
            <div className="contact-divider"></div>

            {/* Account Role Section */}
            <div className="contact-section">
              <label className="contact-label">Account Role</label>
              <div className="role-pill-container">
                <span className="role-pill">
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="profile-card security-card">
            <div className="card-header">
              <h3>Security</h3>
              <span className="card-icon">🔒</span>
            </div>
            <div className="security-section">
              <p className="security-description">
                Keep your account secure by regularly updating your password
              </p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                <span className="btn-icon">🔑</span>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button
                className="modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Current Password</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔐</span>
                  <input
                    type="password"
                    name="oldPassword"
                    value={password.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">New Password</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    type="password"
                    name="newPassword"
                    value={password.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Minimum 6 characters"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Confirm New Password</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">✓</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={password.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Re-enter your new password"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Changing...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">💾</span>
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
