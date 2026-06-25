import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth, signInAnonymously } from 'firebase/auth'

// Replace these with your Firebase config from Firebase Console
// Get your config: Firebase Console > Project Settings > Your apps
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  databaseURL: 'https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database
export const database = getDatabase(app)

// Initialize Auth
export const auth = getAuth(app)

// Sign in anonymously on app load
export const initializeAuth = async () => {
  try {
    const user = auth.currentUser
    if (!user) {
      await signInAnonymously(auth)
    }
    return auth.currentUser
  } catch (error) {
    console.error('Auth error:', error)
    throw error
  }
}
