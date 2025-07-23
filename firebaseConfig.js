// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxX_r_FTLDIKx1gZBs7gAq-Rs5KnyfRcQ",
  authDomain: "trgovinarm-a948a.firebaseapp.com",
  projectId: "trgovinarm-a948a",
  storageBucket: "trgovinarm-a948a.firebasestorage.app",
  messagingSenderId: "247090906476",
  appId: "1:247090906476:web:43ba257b7a7d76b1295f49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };