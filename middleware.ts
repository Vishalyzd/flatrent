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

  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Verify the session token
      const decodedToken = await auth.verifySessionCookie(session)
      
      // Check if the user has admin role
      if (decodedToken.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // If the session is invalid, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Check if the request is for a protected route (requires authentication)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      await auth.verifySessionCookie(session)
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Check if the path requires authentication
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (!session) {
      // Redirect to sign in page if not authenticated
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  // Check if the path requires specific roles
  for (const [path, roles] of Object.entries(roleProtectedPaths)) {
    if (request.nextUrl.pathname.startsWith(path)) {
      if (!session) {
        // Redirect to sign in page if not authenticated
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }

      // Get user role from token (you'll need to implement this)
      const userRole = getUserRoleFromToken(session)
      
      if (!roles.includes(userRole)) {
        // Redirect to home page if user doesn't have required role
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

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
  matcher: ['/admin/:path*', '/dashboard/:path*'],
} 