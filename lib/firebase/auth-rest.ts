import { auth } from './admin';

export async function verifySessionCookie(sessionCookie: string) {
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
} 