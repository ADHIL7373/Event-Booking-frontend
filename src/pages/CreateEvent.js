/**
 * Create Event Page (Admin)
 * Enhanced with improved validation and UX
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import './CreateEvent.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    totalSeats: '',
    category: 'Other',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formTouched, setFormTouched] = useState(false);

  const categories = ['Conference', 'Concert', 'Workshop', 'Sports', 'Social', 'Other'];

  // Constants for validation
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_TITLE_LENGTH = 100;
  const MIN_DESCRIPTION_LENGTH = 10;
  const MAX_DESCRIPTION_LENGTH = 5000;
  const MAX_TOTAL_SEATS = 100000;
  const MAX_PRICE = 1000000;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (!formTouched) setFormTouched(true);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('❌ Please select a valid image file (PNG, JPG, WebP)');
      console.error('Invalid file type:', file.type);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`❌ Image size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      console.error('File too large:', file.size);
      return;
    }

    // Validate minimum file size (to avoid placeholder/corrupted images)
    if (file.size < 1024) {
      setError('❌ Image file is too small or corrupted');
      return;
    }

    // Save the file to state
    setImageFile(file);
    console.log('imageFile state updated:', file);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result;
      setImagePreview(preview);
      console.log('Preview generated successfully');
    };
    reader.onerror = () => {
      setError('❌ Failed to read image file');
      console.error('FileReader error');
      setImageFile(null);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleRemoveImage = () => {
    console.log('Removing image');
    setImageFile(null);
    setImagePreview(null);
  };

  // Helper function to validate a single field
  const validateField = (fieldName, fieldValue) => {
    switch (fieldName) {
      case 'title':
        if (!fieldValue?.trim()) return 'Event title is required';
        if (fieldValue.trim().length < 3) return 'Event title must be at least 3 characters';
        if (fieldValue.length > MAX_TITLE_LENGTH) return `Event title cannot exceed ${MAX_TITLE_LENGTH} characters`;
        return '';

      case 'description':
        if (!fieldValue?.trim()) return 'Description is required';
        if (fieldValue.trim().length < MIN_DESCRIPTION_LENGTH) return `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`;
        if (fieldValue.length > MAX_DESCRIPTION_LENGTH) return `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`;
        return '';

      case 'date':
        if (!fieldValue) return 'Event date is required';
        return '';

      case 'time':
        if (!fieldValue) return 'Event time is required';
        return '';

      case 'location':
        if (!fieldValue?.trim()) return 'Location is required';
        if (fieldValue.trim().length < 2) return 'Location must be at least 2 characters';
        return '';

      case 'price':
        const price = parseFloat(fieldValue);
        if (isNaN(price)) return 'Ticket price must be a valid number';
        if (price < 0) return 'Ticket price cannot be negative';
        if (price > MAX_PRICE) return `Ticket price cannot exceed ₹${MAX_PRICE}`;
        return '';

      case 'totalSeats':
        const seats = parseInt(fieldValue, 10);
        if (isNaN(seats)) return 'Total seats must be a valid number';
        if (seats < 1) return 'Total seats must be at least 1';
        if (seats > MAX_TOTAL_SEATS) return `Total seats cannot exceed ${MAX_TOTAL_SEATS}`;
        return '';

      default:
        return '';
    }
  };

  // Validate date and time combination
  const validateDateTime = () => {
    const eventDate = new Date(formData.date);
    const [hours, minutes] = formData.time.split(':').map(Number);
    eventDate.setHours(hours, minutes, 0, 0);
    
    const now = new Date();

    if (eventDate <= now) {
      return 'Event date and time must be in the future';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate all fields
    let validationError = '';

    validationError = validationError || validateField('title', formData.title);
    validationError = validationError || validateField('description', formData.description);
    validationError = validationError || validateField('date', formData.date);
    validationError = validationError || validateField('time', formData.time);
    validationError = validationError || validateField('location', formData.location);
    validationError = validationError || validateField('price', formData.price);
    validationError = validationError || validateField('totalSeats', formData.totalSeats);

    if (!validationError) {
      validationError = validateDateTime();
    }

    if (!imageFile) {
      validationError = validationError || '❌ Please select an event image';
    }

    if (validationError) {
      setError('❌ ' + validationError);
      setLoading(false);
      return;
    }

    // All validations passed, try to create event
    try {
      const price = parseFloat(formData.price);
      const totalSeats = parseInt(formData.totalSeats, 10);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('price', price);
      formDataToSend.append('totalSeats', totalSeats);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('image', imageFile);

      console.log('Submitting event creation...');
      await eventService.createEvent(formDataToSend);
      
      setError('');
      console.log('Event created successfully, navigating to dashboard');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('Event creation error:', err);
      
      let errorMsg = 'Failed to create event';
      
      // Extract error message from various sources
      if (typeof err === 'string') {
        errorMsg = err;
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      } else if (err?.error) {
        errorMsg = err.error;
      }
      
      setError('❌ ' + errorMsg);
      console.error('Event creation error details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formTouched && (formData.title || formData.description || imageFile)) {
      const confirmCancel = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmCancel) return;
    }
    navigate('/admin/dashboard');
  };

  return (
    <div className="create-event-page">
      <div className="form-container">
        <h1>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.6rem'}}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <rect x="2" y="3" width="20" height="14" rx="2" fill="#3b82f6" />
              <path d="M7 8h10M7 12h6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="17" cy="6" r="2" fill="#f59e0b" />
            </svg>
            Create New Event
          </span>
        </h1>
        <p>Fill in the details below to create a new event for your platform</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              disabled={loading}
              maxLength={MAX_TITLE_LENGTH}
              required
            />
            <small className="char-count">{formData.title.length}/{MAX_TITLE_LENGTH}</small>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              rows="4"
              disabled={loading}
              maxLength={MAX_DESCRIPTION_LENGTH}
              required
            ></textarea>
            <small className="char-count">{formData.description.length}/{MAX_DESCRIPTION_LENGTH}</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ticket Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="10"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Total Seats *</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                placeholder="0"
                min="1"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Event Image *</label>
            <div className="image-upload-box">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                    disabled={loading}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <label className="upload-label" style={{ cursor: loading ? 'not-allowed' : 'pointer', display: 'block', width: '100%', opacity: loading ? 0.6 : 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    disabled={loading}
                    required
                  />
                  <div className="upload-content">
                    <div className="upload-icon">📸</div>
                    <p className="upload-text">Click to upload or drag and drop</p>
                    <p className="upload-subtext">PNG, JPG, WebP up to 2MB</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
