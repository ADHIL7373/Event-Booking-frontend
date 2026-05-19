/**
 * Review List Component
 * Displays all reviews for an event
 * Apple-style minimal design
 */

import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import './ReviewList.css';

const ReviewList = ({ eventId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingFilter, setRatingFilter] = useState(0);

  const token = localStorage.getItem('token');

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/reviews/${eventId}`, {
        params: {
          page,
          limit: 10,
          sortBy,
          rating: ratingFilter || undefined,
        },
      });

      setReviews(response.data.data);
      setStats(response.data.stats);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [eventId, page, sortBy, ratingFilter, token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleMarkHelpful = async (reviewId, helpful) => {
    try {
      await api.post(`/reviews/${reviewId}/helpful`, { helpful });

      // Refresh reviews
      fetchReviews();
    } catch (err) {
      console.error('Error marking review:', err);
    }
  };

  if (loading) {
    return (
      <div className="review-list-loading">
        <div className="spinner" />
      </div>
    );
  }

  const avgRating = stats?.avgRating || 0;
  const totalReviews = stats?.totalReviews || 0;

  return (
    <div className="review-list-container">
      <div className="review-list-header">
        <h3>Event Reviews</h3>
      </div>

      {error && <div className="review-list-error">{error}</div>}

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="rating-summary">
          <div className="average-rating">
            <div className="average-value">{avgRating.toFixed(1)}</div>
            <div className="average-stars">
              <StarRating value={avgRating} readonly />
            </div>
            <div className="average-count">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Filters */}
          <div className="review-filters">
            <button
              className={`filter-btn ${ratingFilter === 0 ? 'active' : ''}`}
              onClick={() => {
                setRatingFilter(0);
                setPage(1);
              }}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                className={`filter-btn ${
                  ratingFilter === rating ? 'active' : ''
                }`}
                onClick={() => {
                  setRatingFilter(rating);
                  setPage(1);
                }}
              >
                {rating}★
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort */}
      {reviews.length > 0 && (
        <div className="review-sort">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <>
          <div className="reviews-list">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onMarkHelpful={handleMarkHelpful}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="review-pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
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
const ReviewCard = ({ review, onMarkHelpful }) => {
  const [helpfulState, setHelpfulState] = useState({
    helpful: review.helpful || 0,
    unhelpful: review.unhelpful || 0,
  });

  const handleHelpful = async (isHelpful) => {
    await onMarkHelpful(review._id, isHelpful);
    if (isHelpful) {
      setHelpfulState((prev) => ({
        ...prev,
        helpful: prev.helpful + 1,
      }));
    } else {
      setHelpfulState((prev) => ({
        ...prev,
        unhelpful: prev.unhelpful + 1,
      }));
    }
  };

  const reviewDate = new Date(review.reviewedAt);
  const formattedDate = reviewDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.userId?.profileImage ? (
              <img
                src={review.userId.profileImage}
                alt={review.userId.fullName}
              />
            ) : (
              <div className="avatar-placeholder">
                {review.userId?.fullName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="reviewer-details">
            <h4 className="reviewer-name">{review.userId?.fullName}</h4>
            <div className="review-meta">
              <StarRating value={review.rating} readonly />
              <span className="review-date">{formattedDate}</span>
              {review.isVerifiedPurchase && (
                <span className="verified-badge">✓ Verified Purchase</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {review.comment && (
        <p className="review-comment">{review.comment}</p>
      )}

      <div className="review-footer">
        <div className="helpful-buttons">
          <button
            className="helpful-btn"
            onClick={() => handleHelpful(true)}
          >
            👍 Helpful ({helpfulState.helpful})
          </button>
          <button
            className="unhelpful-btn"
            onClick={() => handleHelpful(false)}
          >
            👎 Not Helpful ({helpfulState.unhelpful})
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Star Rating Component (Read-only)
 */
const StarRating = ({ value, readonly = true }) => {
  return (
    <div className="star-rating-display">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? 'filled' : 'empty'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default ReviewList;
