import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/messages',
  '/bookings',
  '/properties',
]

// Add paths that require specific roles
const roleProtectedPaths = {
  '/admin': ['admin'],
  '/seller': ['seller'],
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // For now, we'll just check if the session exists
  // In production, you should verify the session token
  return NextResponse.next()
}

// Helper function to get user role from token
function getUserRoleFromToken(token: string): string {
  try {
    // Decode the JWT token and get the role claim
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || 'buyer'
  } catch (error) {
    console.error('Error decoding token:', error)
    return 'buyer'
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/seller/:path*',
    '/buyer/:path*',
  ],
} 