// Firebase configuration for mobile app
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  GoogleAuthProvider,
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore 
} from 'firebase/firestore';
import { 
  getStorage, 
  FirebaseStorage 
} from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Firebase configuration - using same config as web app
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyBGNllbI87OaBWbj4TLbsispili9_JHxMU",
  authDomain: "bolta-12e5a.firebaseapp.com",
  projectId: "bolta-12e5a",
  storageBucket: "bolta-12e5a.firebasestorage.app",
  messagingSenderId: "1065950844272",
  appId: "1:1065950844272:web:662d0d5fc84b486226abb5",
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
      `Missing required Firebase configuration: ${missing.join(', ')}.`
    );
  }
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  // Validate configuration
  validateConfig(firebaseConfig);
  
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth with AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Initialize Storage
  storage = getStorage(app);

  console.log('Firebase initialized successfully');
  
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Connection test function
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Simple test to check if Firebase is accessible
    const testDoc = db.collection ? true : false;
    return testDoc;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Export Firebase services
export { app, auth, db, storage };
export default app;