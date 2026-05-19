/**
 * Event Card Component
 * Displays event information in card format
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../services/imageUrlService';
import './EventCard.css';

const EventCard = ({ event }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const checkWishlistStatus = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/wishlist/check/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsWishlisted(response.data.inWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  }, [event._id, token]);

  useEffect(() => {
    if (token) {
      checkWishlistStatus();
    }
  }, [checkWishlistStatus, token]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();

    if (!token) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        'http://localhost:5000/api/wishlist',
        { eventId: event._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get image URL - handles both external URLs and local uploads
  const imageUrl = getImageUrl(event.image);

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const occupancyPercentage = (
    ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100
  ).toFixed(0);

  return (
    <div className="event-card">
      <div className="event-image">
        <img 
          src={imageUrl} 
          alt={event.title}
          onError={(e) => {
            console.error('Image load error for:', event.title);
            e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500';
          }}
        />
        <span className="event-category">{event.category}</span>

        {/* Wishlist Button */}
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          disabled={loading}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-location">📍 {event.location}</p>

        <div className="event-meta">
          <span className="event-date">📅 {formattedDate} at {event.time}</span>
          <span className="event-price"><span className="currency-symbol">₹</span>{event.price}</span>
        </div>

        <div className="seats-info">
          <div className="seats-bar">
            <div
              className="seats-filled"
              style={{ width: `${occupancyPercentage}%` }}
            ></div>
          </div>
          <p className="seats-text">
            {event.availableSeats} of {event.totalSeats} seats available
          </p>
        </div>

        {event.availableSeats > 0 ? (
          <Link to={`/events/${event._id}`} className="btn-view">
            View & Book
          </Link>
        ) : (
          <button className="btn-sold-out" disabled>
            Sold Out
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
