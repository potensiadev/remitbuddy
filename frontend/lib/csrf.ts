// Browser-compatible CSRF token generation
// Note: For production, use server-side generation with proper crypto

// Generate a random CSRF token (client-side compatible)
export function generateCSRFToken(): string {
  // Use Web Crypto API if available, fallback to Math.random
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for server-side or older browsers
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Simple hash function for browser compatibility
async function simpleHash(message: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback simple hash
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// Verify CSRF token
export async function verifyCSRFToken(token: string, hashedToken: string): Promise<boolean> {
  if (!token || !hashedToken) {
    return false;
  }
  
  const tokenHash = await simpleHash(token);
  return tokenHash === hashedToken;
}

// Generate token for client-side use
export function getCSRFTokenForClient(): string {
  if (typeof window !== 'undefined') {
    // On client side, get from meta tag or generate new one
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) {
      return metaToken;
    }
  }
  
  // Generate new token
  return generateCSRFToken();
}