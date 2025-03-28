import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase/admin'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    console.log('Session API: Starting session creation...');
    
    // Ensure we have a valid request
    if (!request.body) {
      console.error('Session API: No request body');
      return NextResponse.json(
        { error: 'No request body' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Session API: Request body received:', { hasIdToken: !!body.idToken });
    
    const { idToken } = body;
    
    if (!idToken) {
      console.error('Session API: No ID token provided');
      return NextResponse.json(
        { error: 'No ID token provided' },
        { status: 400 }
      );
    }

    console.log('Session API: Verifying ID token...');
    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log('Session API: Token verified for user:', decodedToken.uid);

    // Create a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    console.log('Session API: Creating session cookie...');
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    console.log('Session API: Session cookie created successfully');

    // Set the session cookie
    const response = NextResponse.json({ status: 'success' });
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax'
    });

    console.log('Session API: Session creation completed successfully');
    return response;
  } catch (error: any) {
    console.error('Session API: Error creating session:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name
    });
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/invalid-id-token') {
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 }
      );
    }
    
    if (error.code === 'auth/expired-id-token') {
      return NextResponse.json(
        { error: 'Expired ID token' },
        { status: 401 }
      );
    }
    
    if (error.code === 'auth/revoked-id-token') {
      return NextResponse.json(
        { error: 'Revoked ID token' },
        { status: 401 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    console.log('Session API: Starting session deletion...');
    const response = NextResponse.json({ status: 'success' });
    response.cookies.delete('session');
    console.log('Session API: Session deleted successfully');
    return response;
  } catch (error) {
    console.error('Session API: Error deleting session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 