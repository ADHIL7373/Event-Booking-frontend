/**
 * Event Detail Page
 * Shows event details and booking form
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import bookingService from '../services/bookingService';
import { getImageUrl } from '../services/imageUrlService';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import LoadingSpinner from '../components/LoadingSpinner';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data.event);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      const result = await bookingService.createBooking(id, numberOfTickets);
      // Redirect to payment page instead of direct ticket
      navigate(`/payment/${result.booking._id}`);
    } catch (err) {
      setError(err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  if (!event) {
    return <div className="error-container">Event not found</div>;
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const totalPrice = numberOfTickets * event.price;
  const occupancyPercentage = (
    ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100
  ).toFixed(0);

  // Construct image URL from filename
  const getImageUrl = () => {
    if (!event || !event.image) {
      return 'https://via.placeholder.com/400x300?text=Event+Image';
    }
    return getImageUrl(event.image);
  };

  return (
    <div className="event-detail-page">
      <div className="event-detail-container">
        <div className="event-image-section">
          <img src={getImageUrl()} alt={event.title} className="event-detail-image" />
          <span className="category-badge">{event.category}</span>
        </div>

        <div className="event-info-section">
          <h1>{event.title}</h1>

          <div className="event-info-grid">
            <div className="info-item">
              <strong>📅 Date & Time</strong>
              <p>{formattedDate} at {event.time}</p>
            </div>
            <div className="info-item">
              <strong>📍 Location</strong>
              <p>{event.location}</p>
            </div>
            <div className="info-item">
              <strong>💰 Price per Ticket</strong>
              <p className="price"><span className="currency-symbol">₹</span>{event.price}</p>
            </div>
          </div>

          <div className="description">
            <h3>About Event</h3>
            <p>{event.description}</p>
          </div>

          <div className="availability-section">
            <h3>Availability</h3>
            <div className="availability-bar">
              <div
                className="availability-fill"
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
            <p className="availability-text">
              {event.availableSeats} of {event.totalSeats} seats available ({occupancyPercentage}% occupied)
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {event.availableSeats > 0 ? (
            <form className="booking-form" onSubmit={handleBooking}>
              <div className="form-group">
                <label>Number of Tickets</label>
                <div className="ticket-selector">
                  <button
                    type="button"
                    onClick={() => setNumberOfTickets(Math.max(1, numberOfTickets - 1))}
                    className="btn-quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={numberOfTickets}
                    onChange={(e) => setNumberOfTickets(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    min="1"
                    max={Math.min(10, event.availableSeats)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNumberOfTickets(Math.min(Math.min(10, event.availableSeats), numberOfTickets + 1))
                    }
                    className="btn-quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="price-summary">
                <div className="price-row">
                  <span>Ticket Price:</span>
                  <span><span className="currency-symbol">₹</span>{event.price} × {numberOfTickets}</span>
                </div>
                <div className="price-row total">
                  <span>Total:</span>
                  <span><span className="currency-symbol">₹</span>{totalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-book"
                disabled={bookingLoading || numberOfTickets > event.availableSeats}
              >
                {bookingLoading ? 'Booking...' : 'Book Now'}
              </button>
            </form>
          ) : (
            <div className="sold-out">
              <p>This event is sold out!</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-container">
          <h2>⭐ Event Reviews & Ratings</h2>
          <ReviewList eventId={id} />
          <ReviewForm eventId={id} />
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
