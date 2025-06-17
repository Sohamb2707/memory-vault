// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD2R9cRGFhlN8S2gW-vjXjaPCZZQZS1wCI",
  authDomain: "memory-vault-09.firebaseapp.com",
  projectId: "memory-vault-09",
  storageBucket: "memory-vault-09.firebasestorage.app",
  messagingSenderId: "105834560365",
  appId: "1:105834560365:web:c3cf290874e090c4d2b864",
  databaseURL:"https://memory-vault-27-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 
