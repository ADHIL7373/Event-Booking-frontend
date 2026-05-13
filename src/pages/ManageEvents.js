/**
 * Manage Events Page (Admin)
 * View and manage all created events with delete option
 */

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import eventService from '../services/eventService';
import api from '../services/api';
import { useTheme } from '../context/useTheme';
import './ManageEvents.css';

const ManageEvents = () => {
  const { isDark } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      setEvents(response.data.events || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(eventId);
    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter(e => e._id !== eventId));
      setSuccessMessage(`✅ "${eventTitle}" deleted successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter events
  let filteredEvents = [...events];
  if (searchQuery) {
    filteredEvents = filteredEvents.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort events
  if (sortBy === 'newest') {
    filteredEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'oldest') {
    filteredEvents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortBy === 'date') {
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === 'price-low') {
    filteredEvents.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredEvents.sort((a, b) => b.price - a.price);
  }

  if (loading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  return (
    <div className={`manage-events-page ${isDark ? 'dark' : ''}`}>
      <div className="manage-container">
        <div className="manage-header">
          <h1>📋 Manage Events</h1>
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="manage-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search events by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="date">Event Date (Soon)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Events List */}
        <div className="events-list">
          {filteredEvents.length > 0 ? (
            <div className="table-container">
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Event Image</th>
                    <th>Title</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Seats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="event-row">
                      <td className="image-cell">
                        <img 
                          src={(() => {
                            const img = event.image || '';
                            if (img.startsWith('http://') || img.startsWith('https://')) return img;
                            if (img.startsWith('/uploads')) return `http://localhost:5000${img}`;
                            if (img.includes('/uploads/')) return `http://localhost:5000/${img.replace(/^\/+/, '')}`;
                            return `http://localhost:5000/uploads/${img}`;
                          })()}
                          alt={event.title}
                          className="event-thumb"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x60?text=Event';
                          }}
                        />
                      </td>
                      <td className="title-cell">
                        <span className="event-title">{event.title}</span>
                      </td>
                      <td className="date-cell">
                        <span className="event-date">
                          {new Date(event.date).toLocaleDateString('en-IN')}
                        </span>
                        <span className="event-time">{event.time}</span>
                      </td>
                      <td className="location-cell">
                        <span className="event-location">📍 {event.location}</span>
                      </td>
                      <td className="price-cell">
                        <span className="event-price">₹{event.price}</span>
                      </td>
                      <td className="category-cell">
                        <span className="category-badge">{event.category}</span>
                      </td>
                      <td className="seats-cell">
                        <span className="seats-info">
                          {event.availableSeats}/{event.totalSeats}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          disabled={deletingId === event._id}
                          title="Delete event"
                        >
                          {deletingId === event._id ? '⏳ Deleting...' : '🗑️ Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h2>📭 No Events Found</h2>
              <p>
                {searchQuery 
                  ? 'Try adjusting your search filters' 
                  : 'No events available'}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredEvents.length > 0 && (
          <div className="summary-section">
            <p>Showing <strong>{filteredEvents.length}</strong> of <strong>{events.length}</strong> events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
