// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            "AIzaSyBGNllbI87OaBWbj4TLbsispili9_JHxMU",
  authDomain:        "bolta-12e5a.firebaseapp.com",
  projectId:         "bolta-12e5a",
  storageBucket:     "bolta-12e5a.firebasestorage.app",
  messagingSenderId: "1065950844272",
  appId:             "1:1065950844272:web:662d0d5fc84b486226abb5",
};

const app = initializeApp(firebaseConfig);
export const auth   = getAuth(app);
export const googleProvider  = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();