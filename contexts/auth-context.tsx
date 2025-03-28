"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import type { User } from '@/types/database'
import { userService } from '@/lib/firebase/db'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: 'buyer' | 'seller' | 'admin') => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.log('Auth state changed - user found:', firebaseUser.email);
          let userData = await userService.getById(firebaseUser.uid);
          
          // If no user data exists, wait briefly and try again
          if (!userData) {
            console.log('User data not found, waiting briefly...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            userData = await userService.getById(firebaseUser.uid);
          }

          if (!userData) {
            console.log('Still no user data, creating new user document...');
            await userService.create({
              email: firebaseUser.email!,
              name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
              role: 'buyer',
            }, firebaseUser.uid);
            
            // Get the newly created user data
            userData = await userService.getById(firebaseUser.uid);
            if (!userData) {
              throw new Error('Failed to create user data');
            }
          }
          
          setUser(userData);
        } catch (error) {
          console.error('Error loading user data:', error);
          await signOut(auth);
          setUser(null);
        }
      } else {
        console.log('Auth state changed - no user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userData = await userService.getById(userCredential.user.uid)
      if (!userData) {
        throw new Error('User data not found')
      }
      setUser(userData)

      // Create session cookie
      const idToken = await userCredential.user.getIdToken()
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create session')
      }
    } catch (error: any) {
      console.error('Error signing in:', error)
      if (error.code === 'auth/user-not-found') {
        throw new Error('No user found with this email')
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address')
      } else {
        throw new Error(error.message || 'Failed to sign in')
      }
    }
  }

  const signUp = async (email: string, password: string, role: 'buyer' | 'seller' | 'admin') => {
    try {
      console.log('Starting signup process...')
      console.log('Email:', email)
      console.log('Role:', role)
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }
      
      // Create Firebase auth user
      console.log('Creating Firebase auth user...')
      let userCredential
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log('Firebase auth user created:', userCredential.user.uid)
      } catch (authError: any) {
        console.error('Firebase Auth Error:', {
          code: authError.code,
          message: authError.message
        })
        throw authError
      }
      
      // Create user document in Firestore with the Firebase Auth user ID
      console.log('Creating Firestore user document...')
      try {
        await userService.create({
          email,
          role,
          name: email.split('@')[0],
        }, userCredential.user.uid)
        console.log('Firestore user document created')
      } catch (firestoreError: any) {
        console.error('Firestore Error:', {
          code: firestoreError.code,
          message: firestoreError.message
        })
        // If Firestore creation fails, delete the auth user
        await userCredential.user.delete()
        throw firestoreError
      }

      // Get the created user data
      console.log('Fetching user data...')
      const userData = await userService.getById(userCredential.user.uid)
      if (!userData) {
        throw new Error('User data not found')
      }
      console.log('User data fetched successfully')
      setUser(userData)

      // Create session cookie
      console.log('Creating session cookie...')
      const idToken = await userCredential.user.getIdToken()
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create session')
      }
      console.log('Session cookie created successfully')
    } catch (error: any) {
      console.error('Detailed signup error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already registered')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters')
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection')
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password accounts are not enabled. Please contact support.')
      } else if (error.code === 'auth/internal-error') {
        throw new Error('Internal server error. Please try again later.')
      } else {
        throw new Error(error.message || 'Failed to create account. Please try again.')
      }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)

      // Clear session cookie
      const response = await fetch('/api/auth/session', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to clear session')
      }
    } catch (error: any) {
      console.error('Error signing out:', error)
      throw new Error(error.message || 'Failed to sign out')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 