/**
 * Notifications Page
 * Displays all user notifications and reminders
 * Apple-style minimal design
 */

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import './Notifications.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchNotifications();
  }, [page, filter, token, navigate]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 20,
        read: filter === 'read' ? true : filter === 'unread' ? false : undefined,
      };

      const response = await api.get('/notifications', {
        params,
      });

      setNotifications(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(
        err.response?.data?.message || 'Failed to load notifications'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`, {});

      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error('Error marking notification:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all', {});

      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);

      setNotifications(
        notifications.filter((n) => n._id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      try {
        await api.delete('/notifications');

        setNotifications([]);
      } catch (err) {
        console.error('Error clearing notifications:', err);
        setError('Failed to clear notifications');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>🔔 Notifications</h1>
        <p className="notifications-subtitle">
          {notifications.length === 0
            ? 'No notifications'
            : `${notifications.length} notification${
                notifications.length !== 1 ? 's' : ''
              }`}
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {notifications.length > 0 && (
        <div className="notifications-controls">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => {
                setFilter('all');
                setPage(1);
              }}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => {
                setFilter('unread');
                setPage(1);
              }}
            >
              Unread
            </button>
            <button
              className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
              onClick={() => {
                setFilter('read');
                setPage(1);
              }}
            >
              Read
            </button>
          </div>

          <div className="action-buttons">
            <button
              className="btn-mark-all"
              onClick={handleMarkAllAsRead}
              title="Mark all as read"
            >
              Mark all as read
            </button>
            <button
              className="btn-clear-all"
              onClick={handleClearAll}
              title="Clear all notifications"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h2>No notifications</h2>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <>
          <div className="notifications-list">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
                className="pagination-btn"
              >
                ← Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Notification Card Component
 */
const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder':
        return '⏰';
      case 'booking_confirmation':
        return '✓';
      case 'booking_cancelled':
        return '✕';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'reminder':
        return 'reminder';
      case 'booking_confirmation':
        return 'success';
      case 'booking_cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const formatTime = (createdAt) => {
    const now = new Date();
    const time = new Date(createdAt);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return time.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: time.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div
      className={`notification-card ${getNotificationColor(
        notification.type
      )} ${!notification.read ? 'unread' : ''}`}
    >
      <div className="notification-card-icon">
        {getNotificationIcon(notification.type)}
      </div>

      <div className="notification-card-content" onClick={handleClick}>
        <h3 className="notification-card-title">{notification.title}</h3>
        <p className="notification-card-message">{notification.message}</p>
        <span className="notification-card-time">
          {formatTime(notification.createdAt)}
        </span>
      </div>

      <div className="notification-card-actions">
        {!notification.read && (
          <button
            className="mark-read-icon-btn"
            onClick={() => onMarkAsRead(notification._id)}
            title="Mark as read"
          >
            ✓
          </button>
        )}
        <button
          className="delete-icon-btn"
          onClick={() => onDelete(notification._id)}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;
