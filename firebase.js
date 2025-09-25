// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA1IIRVcXyeWhDTZaEzg8wYd8tfi8kdKaU",
    authDomain: "fitness-app-7ecc8.firebaseapp.com",
    projectId: "fitness-app-7ecc8",
    // storageBucket: "fitness-app-7ecc8.firebasestorage.app",
    storageBucket: "fitness-app-7ecc8.appspot.com",
    messagingSenderId: "1085549129411",
    appId: "1:1085549129411:android:746d227417adf300847c76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app }; 
// Initialize Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);
// export const firestore = getFirestore(app);
export const storage = getStorage(app);