// src/Untranslatable.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Login from './Login';

export default function Untranslatable() {
  const [expressions, setExpressions] = useState([]);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchExpressions() {
      try {
        const querySnapshot = await getDocs(collection(db, 'expressions'));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setExpressions(data);
      } catch (error) {
        console.error('Erro ao buscar expressões do Firestore:', error);
      }
    }

    fetchExpressions();
  }, []);

  const filtered = expressions.filter((expr) => {
    const query = search.toLowerCase();
    return (
      expr.en.toLowerCase().includes(query) ||
      expr.pt.toLowerCase().includes(query) ||
      (expr.context && expr.context.toLowerCase().includes(query)) ||
      (expr.tone && expr.tone.toLowerCase().includes(query))
    );
  });

  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#fff',
        color: '#000'
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>UNTRANSLATABLE</h1>

      <Login onLogin={setUser} />

      <input
        type="text"
        placeholder="Buscar expressão..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          fontSize: 16,
          padding: 10,
          width: '100%',
          maxWidth: 400,
          marginBottom: 24,
          border: '1px solid #ccc',
          borderRadius: 8
        }}
      />

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}
      >
        {filtered.map((expr, index) => (
          <div
            key={index}
            style={{
              padding: 16,
              border: '1px solid #eee',
              borderRadius: 8,
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              background: '#fff'
            }}
          >
            <p style={{ marginBottom: 8 }}>
              <strong>{expr.en}</strong> — {expr.pt}
            </p>
            <p style={{ fontSize: 14, marginBottom: 4 }}>{expr.context}</p>
            <p style={{ fontSize: 13, fontStyle: 'italic', color: '#555' }}>{expr.tone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
