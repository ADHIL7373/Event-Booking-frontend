/**
 * Events Page
 * Browse and search all available events
 */

import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import eventService from '../services/eventService';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const categories = ['Conference', 'Concert', 'Workshop', 'Sports', 'Social', 'Other'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAllEvents();
      setEvents(data.events || []);
      setFilteredEvents(data.events || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...events];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((e) => e.category === selectedCategory);
    }

    // Search query
    if (searchQuery) {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategory, sortBy, events]);

  if (loading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  return (
    <div className="events-page">
      <div className="events-container">
        <h1>Browse Events</h1>

        {error && <div className="error-message">{error}</div>}

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Search Events</label>
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date">Date (Upcoming)</option>
              <option value="price">Price (Low to High)</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <button className="btn-reset" onClick={() => {
            setSearchQuery('');
            setSelectedCategory('');
            setSortBy('date');
          }}>
            Reset Filters
          </button>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="no-events">
            <p>No events found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
