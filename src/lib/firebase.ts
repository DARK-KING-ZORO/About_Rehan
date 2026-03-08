import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ REPLACE with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCJzmlC2dVFU8Zo4W834K3ryih4FHQH50U",
  authDomain: "earn-pro-web.firebaseapp.com",
  projectId: "earn-pro-web",
  storageBucket: "earn-pro-web.firebasestorage.app",
  messagingSenderId: "283143670782",
  appId: "1:283143670782:web:c0b223fc14a2d1b40bceaf",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
