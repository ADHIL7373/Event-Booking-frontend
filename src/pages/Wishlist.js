/**
 * Wishlist Page
 * Displays user's saved events (wishlist)
 * Apple-style minimal design
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './Wishlist.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchWishlist();
  }, [page, sortBy, token, navigate, fetchWishlist]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/wishlist`, {
        params: { page, limit: 12, sortBy },
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlist(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(
        err.response?.data?.message || 'Failed to load wishlist'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (eventId) => {
    try {
      await axios.delete(`${API_BASE_URL}/wishlist/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlist(wishlist.filter((item) => item.eventId._id !== eventId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove from wishlist');
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await axios.delete(`${API_BASE_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWishlist([]);
      } catch (err) {
        console.error('Error clearing wishlist:', err);
        setError('Failed to clear wishlist');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>❤️ My Wishlist</h1>
        <p className="wishlist-subtitle">
          {wishlist.length === 0
            ? 'No saved events yet'
            : `${wishlist.length} event${wishlist.length !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {wishlist.length > 0 && (
        <div className="wishlist-controls">
          <div className="sort-container">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {wishlist.length > 0 && (
            <button
              className="btn-clear-wishlist"
              onClick={handleClearWishlist}
            >
              Clear Wishlist
            </button>
          )}
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h2>Your wishlist is empty</h2>
          <Link to="/events" className="btn-primary">
            Browse Events
          </Link>
        </div>
      ) : (
        <>
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <WishlistCard
                key={item._id}
                item={item.eventId}
                onRemove={handleRemoveFromWishlist}
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
 * Wishlist Card Component
 */
const WishlistCard = ({ item, onRemove }) => {
  if (!item) return null;

  const eventDate = new Date(item.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const occupancyPercentage = (
    ((item.totalSeats - item.availableSeats) / item.totalSeats) * 100
  ).toFixed(0);

  const getImageUrl = () => {
    if (!item?.image || item.image.trim() === '') {
      return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500';
    }
    const img = item.image.trim();
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const serverUrl = baseUrl.replace('/api', '');
    if (img.startsWith('/uploads')) return `${serverUrl}${img}`;
    return `${serverUrl}/uploads/${img}`;
  };

  return (
    <div className="wishlist-card">
      <div className="wishlist-card-image">
        <img src={getImageUrl()} alt={item.title} />
        <div className="wishlist-card-overlay">
          <Link to={`/events/${item._id}`} className="view-event-btn">
            View Event
          </Link>
        </div>
      </div>

      <div className="wishlist-card-content">
        <div className="wishlist-card-header">
          <h3 className="wishlist-card-title">{item.title}</h3>
          <button
            className="remove-from-wishlist-btn"
            onClick={() => onRemove(item._id)}
            title="Remove from wishlist"
          >
            ✕
          </button>
        </div>

        <p className="wishlist-card-location">📍 {item.location}</p>

        <div className="wishlist-card-meta">
          <span className="wishlist-card-date">
            📅 {formattedDate} at {item.time}
          </span>
          <span className="wishlist-card-price">
            <span className="currency">₹</span>
            {item.price}
          </span>
        </div>

        <div className="wishlist-card-availability">
          <div className="availability-bar">
            <div
              className="availability-fill"
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
          <span className="availability-text">
            {item.availableSeats} seats available
          </span>
        </div>

        <span className="wishlist-card-category">{item.category}</span>
      </div>
    </div>
  );
};

export default WishlistPage;
