/**
 * API Configuration Utility
 * Dynamically determines the correct API base URL based on environment
 */

/**
 * Get API Base URL
 * @returns {string} The API base URL
 */
export const getApiBaseUrl = () => {
  // 1. Check for explicit environment variable (highest priority)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. In browser, detect if running locally and construct URL
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Local development: use same hostname with port 8000
    // Supports: localhost, 127.0.0.1, 192.168.x.x, 10.x.x.x, 172.x.x.x
    if (hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')) {
      return `${protocol}//${hostname}:8000`;
    }
  }

  // 3. Production fallback
  return 'https://remitbuddy.up.railway.app';
};

// Export as default for convenience
export default getApiBaseUrl;
