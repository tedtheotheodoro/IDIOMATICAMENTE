import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function IDIOMATICAMENTE() {
  const [expressions, setExpressions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(); {
    async function fetchExpressions() {
      try {
        const querySnapshot = await getDocs(collection(db, 'expressions'));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setExpressions(data);
      } catch (error) {
        console.error('Erro ao buscar expressões do Firestore:', error);
      }
    }
  }
  setExpressions();
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
        color: '#000',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>IDIOMATICAMENTE</h1>
      <input
        type="text"
        placeholder="Buscar expressão..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 8,
          marginBottom: 24,
          fontSize: 16,
          width: '100%',
          maxWidth: 400,
          border: '1px solid #ccc',
          borderRadius: 8,
        }}
      />
 
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {filtered.map((expr, index) => (
          <div
            key={index}
            style={{
              padding: 16,
              border: '1px solid #ccc',
              borderRadius: 12,
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>{expr.en}</strong> — {expr.pt}
            </p>
            {expr.context && (
              <p style={{ marginTop: 8, fontSize: 14 }}>{expr.context}</p>
            )}
            {expr.tone && (
              <p
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  fontStyle: 'italic',
                  color: '#666',
                }}
              >
                {expr.tone}
              </p>
             )}
          </div>
        ))}
      </div>
    </div>
)}
