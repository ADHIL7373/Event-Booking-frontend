/**
 * Payment Success Modal Component
 * Shows success confirmation with green tick
 */

import React, { useEffect } from 'react';
import './PaymentSuccessModal.css';

const PaymentSuccessModal = ({ isOpen, onClose, amount, eventTitle }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" width="80" height="80">
            <path
              fill="#28a745"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        </div>

        <h2 className="success-title">✅ Payment Successful!</h2>

        <div className="success-details">
          <p>Thank you for your payment.</p>
          <p>We will be in contact with more details shortly.</p>
        </div>

        <div className="payment-info">
          <div className="info-row">
            <span className="label">Event:</span>
            <span className="value">{eventTitle}</span>
          </div>
          <div className="info-row">
            <span className="label">Amount Paid:</span>
            <span className="value amount">₹{amount}</span>
          </div>
        </div>

        <p className="redirect-text">Redirecting to your bookings...</p>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
