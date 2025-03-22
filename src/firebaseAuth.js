// src/firebaseAuth.js
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export function login() {
  return signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}

export function onUserChange(callback) {
  return onAuthStateChanged(auth, callback);
}
