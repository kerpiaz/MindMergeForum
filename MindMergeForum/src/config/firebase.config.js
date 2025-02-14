import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAopgmpG3n_0UQ8O7XCtXqNLp8tWGY_Z6k",
  authDomain: "myapplication-7fc7722d.firebaseapp.com",
  databaseURL: "https://myapplication-7fc7722d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "myapplication-7fc7722d",
  storageBucket: "myapplication-7fc7722d.firebasestorage.app",
  messagingSenderId: "798684416591",
  appId: "1:798684416591:web:d082ec029c707fcce0f83a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);