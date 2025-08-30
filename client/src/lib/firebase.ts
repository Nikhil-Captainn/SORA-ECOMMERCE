import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDZyzGw_y627GG4_6pfBot7mHAP3y4P-vc",
  authDomain: "sora-acc.firebaseapp.com",
  projectId: "sora-acc",
  storageBucket: "sora-acc.firebasestorage.app",
  messagingSenderId: "382393977780",
  appId: "1:382393977780:web:afa8b8b3f3a03b904e00e1",
  measurementId: "G-TWCWMT1R0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const authService = {
  // Signs in a user with email and password
  signInWithEmail: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Signs up a new user with email and password
  signUpWithEmail: async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  },

  // Signs in a user with their Google account
  signInWithGoogle: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },

  // Signs out the current user
  signOut: async () => {
    await signOut(auth);
  },

  // Listens for authentication state changes
  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};