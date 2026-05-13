/**
 * Booking Service
 * Handles all booking-related API calls
 */

import api from './api';

const bookingService = {
  // Create booking
  createBooking: async (eventId, numberOfTickets) => {
    try {
      const response = await api.post('/bookings', {
        eventId,
        numberOfTickets,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Booking failed' };
    }
  },

  // Get user's bookings
  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bookings' };
    }
  },

  // Get booking details
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch booking' };
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || { message: 'Cancellation failed' };
      throw new Error(
        errorData.message ||
          'An error occurred while cancelling the booking. Please try again.'
      );
    }
  },

  // Verify ticket using QR code
  verifyTicket: async (qrData) => {
    try {
      const response = await api.post('/bookings/verify-ticket', {
        qrData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Ticket verification failed' };
    }
  },

  // Get all bookings (Admin)
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch bookings' };
    }
  },

  // Update booking payment status
  updateBookingPaymentStatus: async (bookingId, status) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/payment-status`, {
        paymentStatus: status,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update payment status' };
    }
  },
};

export default bookingService;
