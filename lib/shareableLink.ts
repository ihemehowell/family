// lib/shareableLink.ts
import crypto from 'crypto';

/**
 * Generate a unique token for shareable login links
 * @returns A unique token string
 */
export function generateShareableToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a shareable login link URL
 * @param baseUrl The base URL of your app (e.g., 'https://myapp.com')
 * @param token The generated token
 * @returns The complete shareable link
 */
export function createShareableLink(baseUrl: string, token: string): string {
  return `${baseUrl}/share/${token}`;
}

/**
 * Extract token from shareable link
 * @param url The shareable link URL
 * @returns The extracted token
 */
export function extractTokenFromLink(url: string): string | null {
  const match = url.match(/\/share\/([a-f0-9]{64})$/);
  return match ? match[1] : null;
}
