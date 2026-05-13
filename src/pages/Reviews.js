/**
 * User Reviews Page
 * Displays all reviews written by the user
 * Apple-style minimal design
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './Reviews.css';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchReviews();
  }, [page, sortBy, token, navigate]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:5000/api/reviews/user/my-reviews', {
        params: { page, limit: 10, sortBy },
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(
        err.response?.data?.message || 'Failed to load reviews'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews(reviews.filter((item) => item._id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>⭐ My Reviews</h1>
        <p className="reviews-subtitle">
          {reviews.length === 0
            ? 'No reviews yet'
            : `${reviews.length} review${reviews.length !== 1 ? 's' : ''} written`}
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {reviews.length > 0 && (
        <div className="reviews-controls">
          <div className="sort-container">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <h2>No reviews yet</h2>
          <p>Start reviewing events you've attended to share your experience</p>
        </div>
      ) : (
        <>
          <div className="reviews-list">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onDelete={handleDeleteReview}
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
 * Review Card Component
 */
const ReviewCard = ({ review, onDelete }) => {
  if (!review?.eventId) return null;

  const eventDate = new Date(review.eventId.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const reviewDate = new Date(review.createdAt);
  const formattedReviewDate = reviewDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const getRating = (rating) => {
    const ratings = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return ratings[rating - 1] || 'Unknown';
  };

  const getStarColor = (rating) => {
    if (rating >= 4) return '#10b981'; // Green for excellent
    if (rating >= 3) return '#f59e0b'; // Amber for good
    return '#ef4444'; // Red for poor
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="event-info">
          <h3 className="event-title">{review.eventId.title}</h3>
          <p className="event-details">
            📅 {formattedDate} at {review.eventId.time} • 📍 {review.eventId.location}
          </p>
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(review._id)}
          title="Delete review"
        >
          ✕
        </button>
      </div>

      <div className="review-rating">
        <div className="stars" style={{ color: getStarColor(review.rating) }}>
          {'⭐'.repeat(review.rating)}
        </div>
        <span className="rating-text">{getRating(review.rating)}</span>
      </div>

      {review.comment && (
        <div className="review-comment">
          <p>{review.comment}</p>
        </div>
      )}

      <div className="review-footer">
        <span className="review-date">Reviewed on {formattedReviewDate}</span>
        {review.isVerifiedPurchase && (
          <span className="verified-badge">✓ Verified Purchase</span>
        )}
      </div>

      {review.helpful !== undefined && review.unhelpful !== undefined && (
        <div className="review-stats">
          <span className="helpful">👍 {review.helpful}</span>
          <span className="unhelpful">👎 {review.unhelpful}</span>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
