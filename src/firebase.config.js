import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database'
import { getAuth, signInAnonymously } from 'firebase/auth'

// Replace these with your Firebase config from Firebase Console
// Get your config: Firebase Console > Project Settings > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDyi1gY7ciFaIMoXwW6NxC7J9IHDqKcn2w",
  authDomain: "shopping-list-app-1e599.firebaseapp.com",
  projectId: "shopping-list-app-1e599",
  storageBucket: "shopping-list-app-1e599.firebasestorage.app",
  messagingSenderId: "342623243120",
  appId: "1:342623243120:web:66049578302d4f1263ddb5",
  measurementId: "G-MZNFPQY5W5",
  databaseURL: 'https://shopping-list-app-1e599-default-rtdb.firebaseio.com/',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database
export const database = getDatabase(app)

// Initialize Auth
export const auth = getAuth(app)
export const analytics = getAnalytics(app);

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
