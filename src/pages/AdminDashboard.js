/**
 * Admin Dashboard
 * Original admin dashboard view with overview statistics
 */

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import './AdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data?.dashboard) {
          setDashboard(response.data.dashboard);
          setError('');
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch dashboard';
        setError(errorMsg);
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data?.dashboard) {
          setDashboard(response.data.dashboard);
          setError('');
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch dashboard';
        setError(errorMsg);
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    await fetchDashboard();
  };

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  if (error && !dashboard) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-container">
          <div className="error-container">
            <h2>⚠️ Error Loading Dashboard</h2>
            <p>{error}</p>
            <button className="refresh-btn" onClick={handleRefresh}>
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    totalUsers = 0,
    totalEvents = 0,
    totalBookings = 0,
    totalRevenue = 0,
    bookingsByStatus = {},
    recentBookings = [],
    topEvents = [],
  } = dashboard || {};

  return (
    <div className="admin-dashboard-page">
      <div className="admin-container">
        <div className="dashboard-header">
          <div className="header-left">
            <div className="header-icon">📊</div>
            <h1>Admin Dashboard</h1>
          </div>
          <button 
            className="refresh-btn" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? '🔄 Refreshing...' : '✨ Refresh'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <p className="stat-label">TOTAL USERS</p>
              <p className="stat-value">{Math.max(0, totalUsers)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <p className="stat-label">TOTAL EVENTS</p>
              <p className="stat-value">{Math.max(0, totalEvents)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <p className="stat-label">TOTAL BOOKINGS</p>
              <p className="stat-value">{Math.max(0, totalBookings)}</p>
            </div>
          </div>

          <div className="stat-card revenue-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <p className="stat-label">TOTAL REVENUE</p>
              <p className="stat-value">₹{Math.max(0, totalRevenue).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Bookings by Status */}
        <div className="bookings-status-section">
          <h2>📋 Bookings by Status</h2>
          <div className="status-cards">
            <div className="status-card confirmed">
              <h3>Confirmed</h3>
              <p className="status-count">{Math.max(0, bookingsByStatus.confirmed || 0)}</p>
            </div>
            <div className="status-card cancelled">
              <h3>Cancelled</h3>
              <p className="status-count">{Math.max(0, bookingsByStatus.cancelled || 0)}</p>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="recent-bookings-section">
          <h2>📝 Recent Bookings</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Event</th>
                  <th>Tickets</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.slice(0, 10).map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.userName}</td>
                      <td>{booking.eventName}</td>
                      <td>{Math.max(0, booking.tickets || 0)}</td>
                      <td>₹{Math.max(0, booking.amount || 0)}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>No recent bookings</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Events */}
        {topEvents.length > 0 && (
          <div className="top-events-section">
            <h2>⭐ Top Events</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Bookings</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topEvents.map((event) => (
                    <tr key={event.eventName}>
                      <td>{event.eventName}</td>
                      <td>{Math.max(0, event.bookings || 0)}</td>
                      <td>₹{Math.max(0, event.revenue || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

