import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate Firebase config
if (!firebaseConfig.apiKey) {
  throw new Error('Missing Firebase API Key')
}
if (!firebaseConfig.authDomain) {
  throw new Error('Missing Firebase Auth Domain')
}
if (!firebaseConfig.projectId) {
  throw new Error('Missing Firebase Project ID')
}
if (!firebaseConfig.storageBucket) {
  throw new Error('Missing Firebase Storage Bucket')
}
if (!firebaseConfig.messagingSenderId) {
  throw new Error('Missing Firebase Messaging Sender ID')
}
if (!firebaseConfig.appId) {
  throw new Error('Missing Firebase App ID')
}

// Initialize Firebase
let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  console.log('Firebase initialized successfully')
} catch (error) {
  console.error('Error initializing Firebase:', error)
  throw error
}

// Initialize services
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { app, db, auth, storage } 