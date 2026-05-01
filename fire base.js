import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkpOKakidlZ2WVZNBI9oEFHEjs1EqCt78",
  authDomain: "streamflix-62461.firebaseapp.com",
  projectId: "streamflix-62461",
  storageBucket: "streamflix-62461.firebasestorage.app",
  messagingSenderId: "894473429433",
  appId: "1:894473429433:web:51a0215903fbb277305668"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
