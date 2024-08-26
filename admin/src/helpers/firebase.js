// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAUq3tJLjj0D5EBTOzTLO6du6H5qTKGXtw",
  authDomain: "osbornecampuses.firebaseapp.com",
  projectId: "osbornecampuses",
  storageBucket: "osbornecampuses.appspot.com",
  messagingSenderId: "230247757794",
  appId: "1:230247757794:web:6674813e121022b9a0ebbb",
  measurementId: "G-HX7ZVPPM2G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
