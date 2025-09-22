// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA1IIRVcXyeWhDTZaEzg8wYd8tfi8kdKaU",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "fitness-app-7ecc8",
    storageBucket: "fitness-app-7ecc8.firebasestorage.app",
    messagingSenderId: "1085549129411",
    //   messagingSenderId: "parepallinagavinay1234@gmail.com",
    appId: "1:1085549129411:android:746d227417adf300847c76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);