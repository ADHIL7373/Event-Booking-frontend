/**
 * Image URL Utility
 * Constructs proper image URLs based on the current API server
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

  // Get the server base URL by removing '/api' from the API URL
  const serverUrl = API_BASE_URL.replace('/api', '');

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
