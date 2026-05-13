/**
 * Booking Card Component
 * Displays booking information in card format with refund details
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BookingCard.css';

const BookingCard = ({ booking, onCancel }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Handle case where eventId is not populated (event might be deleted)
  if (!booking?.eventId) {
    return (
      <div className="booking-card">
        <div className="booking-header">
          <h3>Event No Longer Available</h3>
          <span className={`status status-${booking?.status?.toLowerCase() || 'unknown'}`}>
            {booking?.status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
        <div className="booking-details">
          <p><strong>Booking ID:</strong> {booking?._id}</p>
          <p>This event has been deleted or is no longer available.</p>
        </div>
      </div>
    );
  }

  const eventDate = new Date(booking.eventId.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isUpcoming = eventDate > new Date();

  // Calculate potential refund
  const now = new Date();
  const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const daysUntilEvent = hoursUntilEvent / 24;
  
  // Check if user can cancel (must be at least 2 days before event)
  const canCancel = daysUntilEvent >= 2;

  let potentialRefundPercentage = 0;

  if (hoursUntilEvent >= 24) {
    potentialRefundPercentage = 100;
  } else if (hoursUntilEvent >= 12) {
    potentialRefundPercentage = 50;
  } else {
    potentialRefundPercentage = 0;
  }

  const potentialRefundAmount = Math.round(
    (booking.totalPrice * potentialRefundPercentage) / 100
  );

  const handleCancelClick = async () => {
    setIsCancelling(true);
    try {
      await onCancel(booking._id);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Cancellation error:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-header">
        <h3>{booking.eventId.title}</h3>
        <span className={`status status-${booking.status.toLowerCase()}`}>
          {booking.status.toUpperCase()}
        </span>
      </div>

      <div className="booking-details">
        <p>
          <strong>Location:</strong> {booking.eventId.location}
        </p>
        <p>
          <strong>Date:</strong> {formattedDate} at {booking.eventId.time}
        </p>
        <p>
          <strong>Tickets:</strong> {booking.numberOfTickets}
        </p>
        <p>
          <strong>Total Price:</strong> ₹{booking.totalPrice}
        </p>

        {booking.status === 'cancelled' && booking.refundAmount > 0 && (
          <div className="refund-info">
            <strong>Refund Info:</strong>
            <p className="refund-amount">
              ₹{booking.refundAmount} ({booking.refundPercentage}%)
            </p>
            <p className="refund-date">
              Cancelled on: {new Date(booking.cancellationDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="ticket-numbers">
        <strong>Ticket Numbers:</strong>
        <div className="tickets-list">
          {booking.ticketNumbers?.map((ticket, idx) => (
            <span key={idx} className="ticket-badge">
              {ticket}
            </span>
          ))}
        </div>
      </div>

      {/* Refund Preview for Active Bookings */}
      {booking.status === 'confirmed' && isUpcoming && potentialRefundPercentage < 100 && (
        <div className="refund-warning">
          <p className="warning-text">
            ⚠️ Only {potentialRefundPercentage}% refund if cancelled now (₹
            {potentialRefundAmount})
          </p>
        </div>
      )}

      <div className="booking-actions">
        <Link to={`/ticket/${booking._id}`} className="btn-primary">
          View Ticket
        </Link>

        {booking.status === 'confirmed' && isUpcoming && (
          <>
            {canCancel ? (
              <>
                <button
                  className="btn-danger"
                  onClick={() => setShowCancelConfirm(true)}
                  disabled={isCancelling}
                  title="Cancel this booking"
                >
                  {isCancelling ? 'Cancelling...' : '❌ Cancel Booking'}
                </button>

                {/* Cancel Confirmation Modal */}
                {showCancelConfirm && (
                  <div className="cancel-modal-overlay">
                    <div className="cancel-modal">
                      <h2>Cancel Booking?</h2>
                      <p>Are you sure you want to cancel this booking?</p>

                      <div className="refund-details">
                        <p>
                          <strong>Original Price:</strong> ₹{booking.totalPrice}
                        </p>
                        <p>
                          <strong>You will receive:</strong> ₹{potentialRefundAmount} (
                          {potentialRefundPercentage}%)
                        </p>
                        {potentialRefundPercentage === 0 && (
                          <p className="no-refund-warning">
                            ❌ <strong>No refund</strong> - Less than 12 hours to event
                          </p>
                        )}
                      </div>

                      <div className="modal-actions">
                        <button
                          className="btn-secondary"
                          onClick={() => setShowCancelConfirm(false)}
                          disabled={isCancelling}
                        >
                          Keep Booking
                        </button>
                        <button
                          className="btn-danger"
                          onClick={handleCancelClick}
                          disabled={isCancelling}
                        >
                          {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                className="btn-disabled"
                disabled
                title={`Cancellations allowed only 2 days before the event. Days remaining: ${Math.floor(daysUntilEvent)}`}
              >
                ⏰ Cannot Cancel Yet
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
