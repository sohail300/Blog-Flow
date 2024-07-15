// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD6EaPMzCD39xTyiK5b_kcM9e9TIiCzqkM",
  authDomain: "blog-flow-d3f30.firebaseapp.com",
  projectId: "blog-flow-d3f30",
  storageBucket: "blog-flow-d3f30.appspot.com",
  messagingSenderId: "138628540342",
  appId: "1:138628540342:web:b35752eee1ab2ee561c317",
  measurementId: "G-PHP7WWC68Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
