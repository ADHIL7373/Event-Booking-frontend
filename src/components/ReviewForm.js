/**
 * Review Form Component
 * Allows users to write/edit reviews for attended events
 * Apple-style minimal design
 */

import React, { useState } from 'react';
import axios from 'axios';
import './ReviewForm.css';

const ReviewForm = ({ eventId, onReviewSubmitted, existingReview = null }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          eventId,
          rating,
          comment: comment.trim() || '',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(true);
      setRating(0);
      setComment('');

      if (onReviewSubmitted) {
        onReviewSubmitted(response.data.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(
        err.response?.data?.message || 'Failed to submit review'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>Share Your Experience</h3>

      {error && <div className="review-error">{error}</div>}
      {success && (
        <div className="review-success">
          ✓ Review submitted successfully!
        </div>
      )}

      <form className="review-form" onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="form-group">
          <label>Rating</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${
                  star <= (hoveredRating || rating) ? 'active' : ''
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ★
              </button>
            ))}
          </div>
          <div className="rating-text">
            {rating > 0 && (
              <span>
                {rating} star{rating !== 1 ? 's' : ''} -{' '}
                {
                  [
                    '',
                    'Poor',
                    'Fair',
                    'Good',
                    'Very Good',
                    'Excellent',
                  ][rating]
                }
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="form-group">
          <label htmlFor="comment">Your Review (Optional)</label>
          <textarea
            id="comment"
            className="review-textarea"
            placeholder="Share your thoughts about this event..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
          />
          <div className="char-count">
            {comment.length}/1000 characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-submit-review"
          disabled={loading || rating === 0}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
