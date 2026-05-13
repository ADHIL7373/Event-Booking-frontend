/**
 * Event Service
 * Handles all event-related API calls
 */

import api from './api';

const eventService = {
  // Get all events
  getAllEvents: async (category = '', sortBy = '') => {
    try {
      let url = '/events';
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (sortBy) params.append('sortBy', sortBy);
      if (params.toString()) {
        url += '?' + params.toString();
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch events' };
    }
  },

  // Get event by ID
  getEventById: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch event' };
    }
  },

  // Create event (Admin)
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Event service error:', error);
      
      // Extract error message from response
      const backendError = error.response?.data;
      
      if (backendError?.message) {
        throw backendError.message;
      }
      
      if (error.response?.status === 400) {
        throw new Error(backendError?.message || 'Invalid form data. Please check all fields.');
      }
      
      if (error.response?.status === 401) {
        throw new Error('You are not authorized to create events.');
      }
      
      throw new Error(backendError?.message || error?.message || 'Event creation failed');
    }
  },

  // Update event (Admin)
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Event update failed' };
    }
  },

  // Delete event (Admin)
  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Event deletion failed' };
    }
  },

  // Get events by category
  getEventsByCategory: async (category) => {
    try {
      const response = await api.get(`/events/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch events' };
    }
  },

  // Search events
  searchEvents: async (query) => {
    try {
      const response = await api.get(`/events/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Search failed' };
    }
  },
};

export default eventService;
