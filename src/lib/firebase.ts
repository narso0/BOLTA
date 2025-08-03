// src/lib/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  connectAuthEmulator 
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  connectFirestoreEmulator 
} from 'firebase/firestore';
import { 
  getStorage, 
  FirebaseStorage, 
  connectStorageEmulator 
} from 'firebase/storage';
import { 
  getAnalytics, 
  Analytics, 
  isSupported 
} from 'firebase/analytics';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Environment configuration
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// Firebase configuration with environment variables
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBGNllbI87OaBWbj4TLbsispili9_JHxMU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bolta-12e5a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bolta-12e5a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bolta-12e5a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1065950844272",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1065950844272:web:662d0d5fc84b486226abb5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required configuration
const validateConfig = (config: FirebaseConfig): void => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missing = requiredFields.filter(field => !config[field]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required Firebase configuration: ${missing.join(', ')}. ` +
      'Please check your environment variables.'
    );
  }
};

// Validate configuration
try {
  validateConfig(firebaseConfig);
} catch (error) {
  console.error('Firebase configuration error:', error);
  if (isProduction) {
    throw error;
  }
}

// Initialize Firebase app
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize Analytics (only in browser and if supported)
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
    }).catch((error) => {
      console.warn('Analytics initialization failed:', error);
    });
  }

  // Connect to emulators in development
  if (isDevelopment && typeof window !== 'undefined') {
    const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';
    
    if (useEmulators) {
      try {
        // Connect Auth emulator
        if (!auth.config.emulator) {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        }
        
        // Connect Firestore emulator
        if (!db._delegate._databaseId.host.includes('localhost')) {
          connectFirestoreEmulator(db, 'localhost', 8080);
        }
        
        // Connect Storage emulator
        if (!storage._host?.includes('localhost')) {
          connectStorageEmulator(storage, 'localhost', 9199);
        }
        
        console.log('🔥 Connected to Firebase emulators');
      } catch (error) {
        console.warn('Failed to connect to emulators:', error);
      }
    }
  }

  console.log('🔥 Firebase initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  throw error;
}

// Configure auth providers with enhanced settings
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// Auth state management utilities
export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChanged = (callback: (user: any) => void) => {
  return auth.onAuthStateChanged(callback);
};

// Error handling utilities
export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-disabled': 'This account has been disabled. Please contact support',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection and try again',
    'auth/popup-closed-by-user': 'Authentication was cancelled',
    'auth/popup-blocked': 'Popup was blocked. Please allow popups and try again',
    'auth/invalid-credential': 'Invalid credentials provided',
    'auth/credential-already-in-use': 'This credential is already associated with another account',
    'auth/requires-recent-login': 'Please log out and log back in to perform this action',
    'auth/invalid-verification-code': 'Invalid verification code',
    'auth/invalid-verification-id': 'Invalid verification ID'
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again';
};

// Firebase configuration info (for debugging)
export const getFirebaseConfig = () => {
  if (isDevelopment) {
    return {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      isProduction,
      isDevelopment,
      hasAnalytics: !!analytics
    };
  }
  return { projectId: firebaseConfig.projectId };
};

// Health check function
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Simple connection test
    await auth.authStateReady();
    return true;
  } catch (error) {
    console.error('Firebase connection check failed:', error);
    return false;
  }
};

// Export Firebase services
export { 
  app,
  auth, 
  db, 
  storage, 
  analytics,
  googleProvider, 
  facebookProvider 
};

// Export types for better TypeScript support
export type { 
  FirebaseApp, 
  Auth, 
  Firestore, 
  FirebaseStorage, 
  Analytics 
};