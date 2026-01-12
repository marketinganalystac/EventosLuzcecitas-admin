// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNGCfGuqiLI_EIoG98yguRZdbNcGyVDIw",
  authDomain: "eventosluzcecitas-9fd22.firebaseapp.com",
  projectId: "eventosluzcecitas-9fd22",
  storageBucket: "eventosluzcecitas-9fd22.firebasestorage.app",
  messagingSenderId: "41381954314",
  appId: "1:41381954314:web:515148719c1e6fa43eb0f3",
  measurementId: "G-2K5WD7P8CT"
};

const app = initializeApp(firebaseConfig);

// Exportamos para usar en tus componentes
export const db = getFirestore(app);
export const auth = getAuth(app);
