// src/firebase.js

// Firebase v9 Modular SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBqqhaPP2dpEOdIQ8vKE2vUv5C_yU32mkw",
  authDomain: "car-service-zenith-platform.firebaseapp.com",
  projectId: "car-service-zenith-platform",
  storageBucket: "car-service-zenith-platform.appspot.com",
  messagingSenderId: "890237149339",
  appId: "1:890237149339:web:a5222c3c625bc69420263e",
  measurementId: "G-Q7WQ6W1LEB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export individual services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
