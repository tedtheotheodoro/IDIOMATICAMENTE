import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Certifique-se de que esse arquivo existe


const [expressions, setExpressions] = useState([]);

useEffect(() => {
  async function fetchExpressions() {
    try {
      const querySnapshot = await getDocs(collection(db, "expressions"));
      const data = querySnapshot.docs.map(doc => doc.data());
      setExpressions(data);
    } catch (error) {
      console.error("Erro ao buscar expressões do Firestore:", error);
    }
  }

  fetchExpressions();
}, []);


export default function Untranslatable() {
  const [search, setSearch] = useState("");

  const filtered = expressions.filter(expr => {
    const query = search.toLowerCase();
    return (
      expr.en.toLowerCase().includes(query) ||
      expr.pt.toLowerCase().includes(query) ||
      expr.context.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 32 }}>UNTRANSLATABLE</h1>
      <input
        placeholder="Buscar expressão..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: 8, width: '100%', marginBottom: 16 }}
      />
      {filtered.map((expr, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <strong>{expr.en}</strong> — <em>{expr.pt}</em><br />
          <small>{expr.context} | {expr.tone}</small><br />
          <span>Ex: {expr.example}</span>
        </div>
      ))}
    </div>
  );
}