/**
 * Payment Page
 * Handles event ticket payment via dummy card gateway
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import CardPaymentForm from '../components/CardPaymentForm';
import PaymentSuccessModal from '../components/PaymentSuccessModal';
import bookingService from '../services/bookingService';
import './Payment.css';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchBookingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data.booking);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load booking details');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  // Handle card payment submission
  const handleCardPaymentSubmit = async (formData) => {
    try {
      setProcessing(true);
      setError('');

      // Simulate payment processing (dummy gateway)
      // In production, you would send this to your backend to process with Stripe
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update booking payment status to paid
      await bookingService.updateBookingPaymentStatus(bookingId, 'paid');

      // Show success modal
      setShowSuccessModal(true);

      // Redirect after modal closes
      setTimeout(() => {
        navigate('/my-bookings');
      }, 3500);
    } catch (err) {
      setError(err.message || 'Payment processing failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading payment details..." />;
  }

  if (!booking) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="error-container">
            <h2>❌ Error</h2>
            <p>{error || 'Booking not found'}</p>
            <button className="btn-back" onClick={() => navigate('/my-bookings')}>
              ← Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>💳 Payment</h1>
          <p>Complete your booking payment securely</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="payment-content">
          {/* Booking Summary */}
          <div className="booking-summary">
            <h2>📋 Booking Summary</h2>
            <div className="summary-item">
              <span>Event:</span>
              <strong>{booking.eventId?.title}</strong>
            </div>
            <div className="summary-item">
              <span>Date:</span>
              <strong>
                {new Date(booking.eventId?.date).toLocaleDateString()} at {booking.eventId?.time}
              </strong>
            </div>
            <div className="summary-item">
              <span>Location:</span>
              <strong>{booking.eventId?.location}</strong>
            </div>
            <div className="summary-item">
              <span>Tickets:</span>
              <strong>{booking.numberOfTickets}</strong>
            </div>
            <div className="summary-item">
              <span>Price per Ticket:</span>
              <strong><span className="currency-symbol">₹</span>{booking.eventId?.price}</strong>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total Amount:</span>
              <strong><span className="currency-symbol">₹</span>{booking.totalPrice}</strong>
            </div>
          </div>

          {/* Card Payment Form */}
          <CardPaymentForm
            totalAmount={booking.totalPrice}
            onSubmit={handleCardPaymentSubmit}
            isProcessing={processing}
          />
        </div>

        {/* Security Info */}
        <div className="security-info">
          <p>🔒 This is a secure dummy payment gateway for testing purposes.</p>
        </div>

        {/* Cancel Button */}
        <button
          className="btn-cancel"
          onClick={() => navigate(`/events/${booking.eventId?._id}`)}
          disabled={processing}
        >
          Cancel Payment
        </button>
      </div>

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={booking.totalPrice}
        eventTitle={booking.eventId?.title}
      />
    </div>
  );
};

export default Payment;
