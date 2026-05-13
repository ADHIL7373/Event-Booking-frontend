import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminStyles.css';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
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

  const { summary, monthlyRevenue, bookingTrends, popularEvents, topUsers } = data || {};

  return (
    <div className="admin-analytics">
      <h1 className="page-title">Analytics & Insights</h1>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card gradient-blue">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <div className="card-label">Total Users</div>
            <div className="card-value">{summary?.totalUsers?.toLocaleString()}</div>
          </div>
        </div>

        <div className="summary-card gradient-green">
          <div className="card-icon">🎫</div>
          <div className="card-content">
            <div className="card-label">Total Bookings</div>
            <div className="card-value">{summary?.totalBookings?.toLocaleString()}</div>
          </div>
        </div>

        <div className="summary-card gradient-purple">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <div className="card-label">Total Revenue</div>
            <div className="card-value">${summary?.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-grid">
        {/* Monthly Revenue */}
        {monthlyRevenue && monthlyRevenue.length > 0 && (
          <div className="chart-card">
            <h2>Monthly Revenue Trend</h2>
            <div className="simple-chart">
              {monthlyRevenue.map((item, idx) => (
                <div key={idx} className="chart-bar">
                  <div className="bar-value" style={{ height: `${(item.total / Math.max(...monthlyRevenue.map(m => m.total))) * 100}%` }}></div>
                  <div className="bar-label">{item._id.month}/{item._id.year.toString().slice(-2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Trends */}
        {bookingTrends && bookingTrends.length > 0 && (
          <div className="chart-card">
            <h2>Booking Trends</h2>
            <div className="simple-chart">
              {bookingTrends.map((item, idx) => (
                <div key={idx} className="chart-bar">
                  <div className="bar-value" style={{ height: `${(item.count / Math.max(...bookingTrends.map(t => t.count))) * 100}%` }}></div>
                  <div className="bar-label">{item._id.month}/{item._id.year.toString().slice(-2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popular Events */}
      {popularEvents && popularEvents.length > 0 && (
        <div className="admin-section">
          <h2>🌟 Most Popular Events</h2>
          <div className="list-container">
            {popularEvents.map((event, idx) => (
              <div key={event._id} className="list-item">
                <div className="item-rank">#{idx + 1}</div>
                <div className="item-content">
                  <div className="item-title">{event.title}</div>
                  <div className="item-meta">{event.bookingCount} bookings</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Users */}
      {topUsers && topUsers.length > 0 && (
        <div className="admin-section">
          <h2>👑 Top Users by Spending</h2>
          <div className="list-container">
            {topUsers.map((user, idx) => (
              <div key={user._id} className="list-item">
                <div className="item-rank">#{idx + 1}</div>
                <div className="item-content">
                  <div className="item-title">{user.name}</div>
                  <div className="item-meta">{user.bookingCount} bookings • ${user.totalSpent}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
