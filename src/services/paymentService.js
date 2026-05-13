/**
 * Payment Service
 * Handles all payment-related API calls to backend
 */

import api from './api';

const paymentService = {
  // Create payment intent
  createPaymentIntent: async (bookingId) => {
    try {
      const response = await api.post('/payments/create-intent', { bookingId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create payment intent' };
    }
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, bookingId) => {
    try {
      const response = await api.post('/payments/confirm', {
        paymentIntentId,
        bookingId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to confirm payment' };
    }
  },

  // Get payment status
  getPaymentStatus: async (bookingId) => {
    try {
      const response = await api.get(`/payments/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get payment status' };
    }
  },

  // Create checkout session
  createCheckoutSession: async (bookingId) => {
    try {
      const response = await api.post('/payments/checkout-session', { bookingId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create checkout session' };
    }
  },

  // Redirect to Stripe checkout
  redirectToCheckout: async (bookingId) => {
    try {
      const data = await paymentService.createCheckoutSession(bookingId);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;
