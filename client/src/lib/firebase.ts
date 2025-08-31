// D:\Gift Shop E-Commerce\SoraGold\SoraGold\client\src\lib\firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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
const db = getFirestore(app); // Initialize Firestore
const googleProvider = new GoogleAuthProvider();

export const authService = {
  signInWithEmail: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },
  signUpWithEmail: async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  },
  signInWithGoogle: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },
  signOut: async () => {
    await signOut(auth);
  },
  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};

// Add a new service for Firestore
export const firestoreService = {
  addSubscriber: async (email: string) => {
    await addDoc(collection(db, "subscribers"), {
      email: email,
      subscribedAt: serverTimestamp(),
    });
  },
};