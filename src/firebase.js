import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyArzqRMz0xJdopVIy8gkRNLbgMd9LN7JQw",
    authDomain: "emoji-clicker-cf368.firebaseapp.com",
    projectId: "emoji-clicker-cf368",
    storageBucket: "emoji-clicker-cf368.firebasestorage.app",
    messagingSenderId: "129552624222",
    appId: "1:129552624222:web:8fa6c18c4d725623e322cf",
    measurementId: "G-J7GMZ23Z0F"
};

import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
