import { randomBytes, createHash } from 'crypto';

// Generate a random CSRF token
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

// Create a hash of the token for verification
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Verify CSRF token
export function verifyCSRFToken(token: string, hashedToken: string): boolean {
  if (!token || !hashedToken) {
    return false;
  }
  
  const tokenHash = hashToken(token);
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
  
  // Fallback - generate new token (this should be handled by server)
  return generateCSRFToken();
}