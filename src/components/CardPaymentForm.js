/**
 * Card Payment Form Component
 * Dummy payment gateway form for card details
 */

import React, { useState } from 'react';
import './CardPaymentForm.css';

const CardPaymentForm = ({ totalAmount, onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvc: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Card number validation (16 digits)
    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    // Card holder validation
    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'Cardholder name is required';
    }

    // Expiry date validation (MM/YY)
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Format should be MM/YY';
    } else {
      const [month] = formData.expiryDate.split('/');
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      }
    }

    // CVC validation (3-4 digits)
    if (!formData.cvc) {
      newErrors.cvc = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = 'CVC must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value) && value.length <= 16) {
      // Add space every 4 digits
      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
      setFormData({ ...formData, cardNumber: formatted });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      setFormData({ ...formData, expiryDate: value });
    }
  };

  const handleCVCChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setFormData({ ...formData, cvc: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="card-payment-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>💳 Card Information</h3>

        {/* Card Number */}
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            placeholder="1234 1234 1234 1234"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            disabled={isProcessing}
            className={errors.cardNumber ? 'error' : ''}
          />
          {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
        </div>

        {/* Card Holder */}
        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            placeholder="Full name on card"
            value={formData.cardHolder}
            onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
            disabled={isProcessing}
            className={errors.cardHolder ? 'error' : ''}
          />
          {errors.cardHolder && <span className="error-message">{errors.cardHolder}</span>}
        </div>

        {/* Expiry and CVC Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleExpiryChange}
              disabled={isProcessing}
              className={errors.expiryDate ? 'error' : ''}
            />
            {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
          </div>

          <div className="form-group">
            <label>CVC</label>
            <input
              type="text"
              placeholder="123"
              value={formData.cvc}
              onChange={handleCVCChange}
              disabled={isProcessing}
              className={errors.cvc ? 'error' : ''}
              maxLength="4"
            />
            {errors.cvc && <span className="error-message">{errors.cvc}</span>}
          </div>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="amount-summary">
        <div className="summary-row">
          <span>Total Amount:</span>
          <strong className="amount">₹{totalAmount}</strong>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-submit"
        disabled={isProcessing}
      >
        {isProcessing ? '🔄 Processing Payment...' : '💳 Pay Now'}
      </button>

      {/* Security Badge */}
      <div className="security-badge">
        <p>🔒 Secure dummy payment gateway for testing</p>
      </div>
    </form>
  );
};

export default CardPaymentForm;
