"use client"

import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { userService } from "@/lib/firebase/db"
import { useAuth } from "@/contexts/auth-context"
import { UserProfileButton } from "./user-profile-button"

export function OAuthButtons() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // If user is logged in, show the user profile button
  if (user) {
    return <UserProfileButton />
  }

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign-in process...');
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in successful:', result.user.email);
      
      // Get user data
      const userData = await userService.getById(result.user.uid);
      console.log('User data retrieved:', userData);

      // Create user document if it doesn't exist
      if (!userData) {
        console.log('Creating new user document...');
        try {
          await userService.create({
            email: result.user.email!,
            name: result.user.displayName || result.user.email!.split('@')[0],
            role: 'buyer', // Default role for OAuth users
          }, result.user.uid);
          console.log('New user document created successfully');
        } catch (createError) {
          console.error('Error creating user document:', createError);
          // If creation fails, try to get the user data again
          const retryUserData = await userService.getById(result.user.uid);
          if (!retryUserData) {
            throw new Error('Failed to create user document');
          }
        }
      }

      // Wait for a moment to ensure the user document is created and propagated
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create session cookie
      const idToken = await result.user.getIdToken(true); // Force refresh the token
      console.log('Got ID token, creating session cookie...');
      
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Session creation failed:', responseData);
        throw new Error(responseData.error || 'Failed to create session');
      }

      console.log('Session cookie created successfully');
      
      // Force a hard navigation to ensure auth state is updated
      window.location.href = '/dashboard';

    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google sign-in is not enabled. Please contact support.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google sign-in.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleGoogleSignIn}
      >
        <Mail className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
    </div>
  )
} 