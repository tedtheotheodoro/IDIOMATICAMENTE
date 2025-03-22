import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export default function Untranslatable() {
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

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 32 }}>UNTRANSLATABLE</h1>
      <ul>
        {expressions.map((expr, index) => (
          <li key={index}>
            <strong>{expr.en}</strong> — {expr.pt}
            <div>{expr.context}</div>
            <div><em>{expr.tone}</em></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

