import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAXyHiU7vdZJ9HBq8bHPHwxR0Ygbn1ypQ",
  authDomain: "registro-de-caixa.firebaseapp.com",
  projectId: "registro-de-caixa",
  storageBucket: "registro-de-caixa.appspot.com",
  messagingSenderId: "240535073752",
  appId: "1:240535073752:web:057bc8b99cb21c3989f8ad"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);