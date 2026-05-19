/**
 * Image URL Utility
 * Constructs proper image URLs based on the current API server
 */

/**
 * Constructs a full image URL from an image path or filename
 * @param {string} image - The image path/filename from the database
 * @returns {string} - The complete image URL
 */
export const getImageUrl = (image) => {
  // Default fallback image
  const defaultImg = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500';
  
  // If no image provided, return default
  if (!image || (typeof image === 'string' && image.trim() === '')) {
    return defaultImg;
  }

  const img = typeof image === 'string' ? image.trim() : String(image).trim();

  // If already a full URL (external image), return as-is
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }

  // Get the server base URL dynamically
  // Try environment variable first, then derive from current location
  let serverUrl = process.env.REACT_APP_API_URL;
  
  if (!serverUrl) {
    // Fallback: derive from current window location
    // In production (HTTPS Vercel): https://event-booking-backend-suu5.onrender.com
    // In development (HTTP localhost): http://localhost:5000
    if (window.location.protocol === 'https:') {
      // Production environment - use HTTPS backend
      serverUrl = 'https://event-booking-backend-suu5.onrender.com/api';
    } else {
      // Development environment
      serverUrl = 'http://localhost:5000/api';
    }
  }
  
  // Remove '/api' from the URL to get base server URL
  serverUrl = serverUrl.replace('/api', '');

  // Handle various image path formats
  if (img.startsWith('/uploads/')) {
    // Already has /uploads/ prefix
    return `${serverUrl}${img}`;
  } else if (img.includes('/uploads/')) {
    // Has /uploads/ somewhere in the path
    const parts = img.split('/uploads/');
    return `${serverUrl}/uploads/${parts[parts.length - 1]}`;
  } else {
    // Bare filename, add /uploads/ prefix
    const cleanFilename = img.replace(/^\/+/, '');
    return `${serverUrl}/uploads/${cleanFilename}`;
  }
};

export default getImageUrl;

