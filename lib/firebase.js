import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDvQ8e_ocjYKX5GYgNN1XvjXyTsYainMXw",
  authDomain: "enemia-1f7c6.firebaseapp.com",
  projectId: "enemia-1f7c6",
  storageBucket: "enemia-1f7c6.firebasestorage.app",
  messagingSenderId: "985108461714",
  appId: "1:985108461714:web:91f05cba11d81977168e4b",
  measurementId: "G-9RW991DXS4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

