// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-792d4.firebaseapp.com",
  projectId: "mern-estate-792d4",
  storageBucket: "mern-estate-792d4.appspot.com",
  messagingSenderId: "131237197520",
  appId: "1:131237197520:web:e003f7f88d68d9ae0050d5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);