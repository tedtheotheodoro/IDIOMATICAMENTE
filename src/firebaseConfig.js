// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8_uyinOLVz6OQ9nWaT_MMf1BdB7xof_A",
  authDomain: "untranslatable-66db6.firebaseapp.com",
  projectId: "untranslatable-66db6",
  storageBucket: "untranslatable-66db6.appspot.com",
  messagingSenderId: "906137552323",
  appId: "1:906137552323:web:b533f5b4cb6a6312e96976"
};

// Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; // Exportação única (adicione outras se necessário)
