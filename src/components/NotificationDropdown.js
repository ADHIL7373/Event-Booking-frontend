/**
 * Notification Dropdown Component
 * Displays list of notifications with actions
 * Apple-style minimal design
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './NotificationDropdown.css';

const NotificationDropdown = ({ onClose, onNotificationAction }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:5000/api/notifications', {
        params: { limit: 10, read: false },
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(response.data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId, actionUrl) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications(
        notifications.filter((n) => n._id !== notificationId)
      );

      onNotificationAction?.();

      // Navigate to action URL if it exists
      if (actionUrl) {
        onClose?.();
        window.location.href = actionUrl;
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(
        'http://localhost:5000/api/notifications/read-all',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications([]);
      onNotificationAction?.();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications(
        notifications.filter((n) => n._id !== notificationId)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <h3>Notifications</h3>
        {notifications.length > 0 && (
          <button
            className="mark-all-read-btn"
            onClick={handleMarkAllAsRead}
            title="Mark all as read"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && <div className="notification-error">{error}</div>}

      {loading ? (
        <div className="notification-loading">
          <div className="mini-spinner" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="notification-empty">
          <p>No new notifications</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Link to="/notifications" className="notification-dropdown-footer">
        View All Notifications →
      </Link>
    </div>
  );
};

/**
 * Notification Item Component
 */
const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
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

  const formatTime = (createdAt) => {
    const now = new Date();
    const time = new Date(createdAt);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;

    return time.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="notification-item">
      <div className="notification-icon">
        {getNotificationIcon(notification.type)}
      </div>

      <div
        className="notification-content"
        onClick={() =>
          onMarkAsRead(notification._id, notification.actionUrl)
        }
      >
        <h4 className="notification-title">{notification.title}</h4>
        <p className="notification-message">{notification.message}</p>
        <span className="notification-time">
          {formatTime(notification.createdAt)}
        </span>
      </div>

      <button
        className="notification-delete-btn"
        onClick={() => onDelete(notification._id)}
        title="Delete notification"
      >
        ✕
      </button>
    </div>
  );
};

export default NotificationDropdown;
