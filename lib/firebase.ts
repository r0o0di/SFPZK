import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBgewS8DQa1UqBDDAV6gGsoLUkREzYvJEc",
  authDomain: "sfpzk-s.firebaseapp.com",
  projectId: "sfpzk-s",
  storageBucket: "sfpzk-s.firebasestorage.app",
  messagingSenderId: "602154646398",
  appId: "1:602154646398:web:eb5a73b518d454a700512f",
  measurementId: "G-B4YFP557BL"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();