// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (🔥 ok compartilhar publicamente, essas chaves não dão acesso root)
const firebaseConfig = {
  apiKey: "AIzaSyB8_uyinOLVz6OQ9nWaT_MMf1BdB7xof_A",
  authDomain: "untranslatable-66db6.firebaseapp.com",
  projectId: "untranslatable-66db6",
  storageBucket: "untranslatable-66db6.firebasestorage.app",
  messagingSenderId: "906137552323",
  appId: "1:906137552323:web:b533f5b4cb6a6312e96976"
};

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Inicializa Auth e Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Inicializa o provedor de login do Google
const provider = new GoogleAuthProvider();

// Exporta as instâncias
export { auth, firestore, provider };
