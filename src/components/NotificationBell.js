/**
 * Notification Bell Component
 * Displays notification bell in navbar with unread count
 * Apple-style minimal design
 */

import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import NotificationDropdown from './NotificationDropdown';
import './NotificationBell.css';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    // Fetch unread count on mount
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [token]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleNotificationAction = () => {
    // Refresh unread count when user marks as read
    fetchUnreadCount();
  };

  if (!token) return null;

  return (
    <div className="notification-bell-wrapper" ref={bellRef}>
      <button
        className="notification-bell-btn"
        onClick={() => setShowDropdown(!showDropdown)}
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <NotificationDropdown
          onClose={() => setShowDropdown(false)}
          onNotificationAction={handleNotificationAction}
        />
      )}
    </div>
  );
};

export default NotificationBell;
