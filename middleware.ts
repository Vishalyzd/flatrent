import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/firebase/admin'

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

  try {
    const decodedClaims = await auth.verifySessionCookie(session, true)
    const response = NextResponse.next()
    response.headers.set('x-user-id', decodedClaims.uid)
    return response
  } catch (error) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
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