// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (substitua pelos seus dados reais)
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

// Configuração de autenticação
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configurações adicionais do provedor Google
provider.setCustomParameters({
  prompt: "select_account" // Força a seleção de conta
});

// Persistência de sessão (opcional)
setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Erro na persistência de autenticação:", error);
  });

// Inicialização do Firestore
const db = getFirestore(app);

// Exportações
export { 
  auth, 
  db, 
  provider,
  app // Exporte o app se precisar de outros serviços Firebase
};