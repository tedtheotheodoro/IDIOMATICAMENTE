import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export default function Untranslatable() {
  const [expressions, setExpressions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchExpressions() {
      try {
        const querySnapshot = await getDocs(collection(db, "expressions"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setExpressions(data);
      } catch (error) {
        console.error("Erro ao buscar expressões do Firestore:", error);
      }
    }

    fetchExpressions();
  }, []);

  const filtered = expressions.filter((expr) => {
    const query = search.toLowerCase();
    return (
      expr.en.toLowerCase().includes(query) ||
      expr.pt.toLowerCase().includes(query) ||
      expr.context?.toLowerCase().includes(query) ||
      expr.tone?.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 32 }}>UNTRANSLATABLE</h1>
      <input
        type="text"
        placeholder="Buscar expressão..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20, padding: 8, width: "100%" }}
      />
      <ul>
        {filtered.map((expr, index) => (
          <li key={index} style={{ marginBottom: 16 }}>
            <p>
              <strong>{expr.en}</strong> — <em>{expr.pt}</em>
              <br />
              <small>{expr.context} | {expr.tone}</small>
              <br />
              {expr.example && <span>Ex: {expr.example}</span>}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 32 }}>UNTRANSLATABLE</h1>
      <input
        type="text"
        placeholder="Buscar expressão..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 8, width: "100%", maxWidth: 400, marginBottom: 20 }}
      />
      <ul>
        {filtered.map((expr, index) => (
          <li key={index} style={{ marginBottom: 16 }}>
            <strong>{expr.en}</strong> — <em>{expr.pt}</em><br />
            <small>{expr.context} | {expr.tone}</small>
          </li>
        ))}
      </ul>
    </div>
  );

