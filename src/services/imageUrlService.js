/**
 * Image URL Utility
 * Constructs proper image URLs based on the current API server
 * Handles both development and production environments
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

  // If already an external full URL (http/https and not localhost), return as-is
  if ((img.startsWith('http://') || img.startsWith('https://')) && !img.includes('localhost')) {
    return img;
  }

  // CRITICAL: Replace any localhost references with production Render backend
  let normalizedImg = img;
  if (img.includes('localhost:5000')) {
    // Strip out localhost:5000 and keep just the path
    normalizedImg = img.replace('http://localhost:5000', '');
  }

  // Determine the correct server URL
  let serverUrl = 'https://event-booking-backend-suu5.onrender.com'; // Default to production

  // Try to use environment variable if available
  const apiUrl = process.env.REACT_APP_API_URL;
  if (apiUrl && apiUrl.includes('localhost')) {
    // If env var points to localhost, we're in development
    serverUrl = 'http://localhost:5000';
  } else if (apiUrl) {
    // Use the env var as-is, remove '/api' suffix if present
    serverUrl = apiUrl.replace('/api', '');
  } else {
    // Auto-detect based on current protocol
    if (window && window.location && window.location.protocol === 'https:') {
      serverUrl = 'https://event-booking-backend-suu5.onrender.com';
    } else {
      serverUrl = 'http://localhost:5000';
    }
  }

  // Handle various image path formats
  if (normalizedImg.startsWith('/uploads/')) {
    // Already has /uploads/ prefix
    return `${serverUrl}${normalizedImg}`;
  } else if (normalizedImg.includes('/uploads/')) {
    // Has /uploads/ somewhere in the path
    const parts = normalizedImg.split('/uploads/');
    return `${serverUrl}/uploads/${parts[parts.length - 1]}`;
  } else if (normalizedImg.startsWith('http://') || normalizedImg.startsWith('https://')) {
    // Already a full URL (e.g., Unsplash), return as-is
    return normalizedImg;
  } else {
    // Bare filename, add /uploads/ prefix
    const cleanFilename = normalizedImg.replace(/^\/+/, '');
    return `${serverUrl}/uploads/${cleanFilename}`;
  }
};

export default getImageUrl;

