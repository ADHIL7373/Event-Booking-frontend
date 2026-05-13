/**
 * My Bookings Page
 * Shows user's all bookings with refund information
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import bookingService from '../services/bookingService';
import './MyBookings.css';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getUserBookings();
      // Filter out bookings where event was deleted (eventId is null)
      const validBookings = (data.bookings || []).filter(b => b.eventId !== null);
      setBookings(validBookings);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      const response = await bookingService.cancelBooking(bookingId);

      // Show success with refund details
      const { booking } = response;
      let successMessage = 'Booking cancelled successfully!';

      if (booking.refundAmount > 0) {
        successMessage += ` You will receive ₹${booking.refundAmount} (${booking.refundPercentage}% refund).`;
      } else {
        successMessage += ' No refund as cancellation was within 12 hours of the event.';
      }

      setSuccess(successMessage);

      // Refresh bookings to show updated status
      setTimeout(() => {
        fetchBookings();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Cancellation failed. Please try again.');
      console.error('Cancellation error:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your bookings..." />;
  }

  return (
    <div className="my-bookings-page">
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <button className="btn-back" onClick={() => navigate('/events')}>
            ← Back
          </button>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <strong>Success:</strong> {success}
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="bookings-list">
            {/* Separate confirmed and cancelled bookings */}
            {bookings.filter((b) => b.status === 'confirmed').length > 0 && (
              <div className="bookings-grid">
                {bookings
                  .filter((b) => b.status === 'confirmed')
                  .map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onCancel={handleCancel}
                    />
                  ))}
              </div>
            )}

            {bookings.filter((b) => b.status === 'cancelled').length > 0 && (
              <div className="bookings-section">
                <h2 className="section-title">Cancelled Bookings</h2>
                <div className="bookings-grid">
                  {bookings
                    .filter((b) => b.status === 'cancelled')
                    .map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        onCancel={handleCancel}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="no-bookings">
            <p>You haven't booked any events yet.</p>
            <p>Browse events and book your first ticket now!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
