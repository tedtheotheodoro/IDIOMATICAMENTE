import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

// Config do Firebase (🔥 ok compartilhar publicamente, essas chaves não dão acesso root)
const firebaseConfig = {
  apiKey: "AIzaSyB8_uyinOLVz6OQ9nWaT_MMf1BdB7xof_A",
  authDomain: "untranslatable-66db6.firebaseapp.com",
  projectId: "untranslatable-66db6",
  storageBucket: "untranslatable-66db6.firebasestorage.app",
  messagingSenderId: "906137552323",
  appId: "1:906137552323:web:b533f5b4cb6a6312e96976"
}

// Inicializa o app só se ainda não tiver sido iniciado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

// Exporta as instâncias
const auth = firebase.auth()
const firestore = firebase.firestore()
const db = firestore // ← alias para ficar compatível com outros arquivos

const provider = new firebase.auth.GoogleAuthProvider()

export { firebase, auth, firestore, db, provider }
