// src/Login.js
import { useEffect, useState } from "react";
import { login, logout, onUserChange } from "./firebaseAuth";

export default function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onUserChange(setUser);
    return () => unsubscribe(); // cleanup
  }, []);

  if (user) {
    return (
      <div>
        <p>Olá, {user.displayName}!</p>
        <button onClick={logout}>Sair</button>
      </div>
    );
  }

  return <button onClick={login}>Entrar com Google</button>;
}
