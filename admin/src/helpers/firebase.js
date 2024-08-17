// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAu2WzzRMkXnwUmpcGMFqxosIVH_om2ix0",
  authDomain: "campuses-9d5d9.firebaseapp.com",
  projectId: "campuses-9d5d9",
  storageBucket: "campuses-9d5d9.appspot.com",
  messagingSenderId: "542803586216",
  appId: "1:542803586216:web:7c82b8ff4cf29f67ff669d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
