import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminStyles.css';

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/analytics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setData(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-banner">{error}</div>;

  const { summary, monthlyRevenue, popularEvents, topUsers } = data || {};

  return (
    <div className="admin-overview">
      <h1 className="page-title">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <div className="card-label">Total Users</div>
            <div className="card-value">{summary?.totalUsers?.toLocaleString()}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">🎫</div>
          <div className="card-content">
            <div className="card-label">Total Bookings</div>
            <div className="card-value">{summary?.totalBookings?.toLocaleString()}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <div className="card-label">Total Revenue</div>
            <div className="card-value">${summary?.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Popular Events */}
      {popularEvents && popularEvents.length > 0 && (
        <div className="admin-section">
          <h2>Most Popular Events</h2>
          <div className="events-list">
            {popularEvents.map((event, idx) => (
              <div key={event._id} className="event-item">
                <div className="event-rank">#{idx + 1}</div>
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-meta">{event.bookingCount} bookings</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Users */}
      {topUsers && topUsers.length > 0 && (
        <div className="admin-section">
          <h2>Top Users</h2>
          <div className="users-list">
            {topUsers.map((user, idx) => (
              <div key={user._id} className="user-item">
                <div className="user-rank">#{idx + 1}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-meta">{user.bookingCount} bookings • ${user.totalSpent}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
