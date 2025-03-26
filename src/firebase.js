// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB8_uyinOLVz6OQ9nWaT_MMf1BdB7xof_A",
  authDomain: "untranslatable-66db6.firebaseapp.com",
  projectId: "untranslatable-66db6",
  storageBucket: "untranslatable-66db6.appspot.com",
  messagingSenderId: "906137552323",
  appId: "1:906137552323:web:b533f5b4cb6a6312e96976"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Instâncias de Auth e Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);

export { auth, provider, firestore };
