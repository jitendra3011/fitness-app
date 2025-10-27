// whem we deploy code it should have to use code ..upper code do commemt it was just for testimg
// // firebase.js
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyA1IIRVcXyeWhDTZaEzg8wYd8tfi8kdKaU",
    authDomain: "fitness-app-7ecc8.firebaseapp.com",
    projectId: "fitness-app-7ecc8",
    storageBucket: "fitness-app-7ecc8.appspot.com",
    messagingSenderId: "1085549129411",
    appId: "1:1085549129411:android:746d227417adf300847c76"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth, db, storage };