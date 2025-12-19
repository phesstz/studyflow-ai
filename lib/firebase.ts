import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // MUDANÇA AQUI, MORTY!

const firebaseConfig = {
  apiKey: "AIzaSyBoMF7N0LLdwTI57iL0-Zw4sarkOLS2Rn8",
  authDomain: "studyflow-web-2619b.firebaseapp.com",
  projectId: "studyflow-web-2619b",
  storageBucket: "studyflow-web-2619b.firebasestorage.app",
  messagingSenderId: "79203579022",
  appId: "1:79203579022:web:fbdd8f4d341d37764905df",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// MUDANÇA AQUI TAMBÉM: Use getFirestore, não getDatabase!
const db = getFirestore(app); 
const auth = getAuth(app);

export { app, db, auth };