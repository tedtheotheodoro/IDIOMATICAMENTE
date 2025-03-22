// src/Untranslatable.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { auth, login, logout, onUserChange } from './firebaseAuth';

export default function Untranslatable() {
  const [expressions, setExpressions] = useState([]);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    en: '',
    pt: '',
    context: '',
    tone: ''
  });

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

  useEffect(() => {
    const unsubscribe = onUserChange(setUser);
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'expressions'), formData);
      setFormData({ en: '', pt: '', context: '', tone: '' });
    } catch (error) {
      console.error('Erro ao adicionar expressão:', error);
    }
  };

  const filtered = expressions.filter((expr) => {
    const query = search.toLowerCase();
    return (
      expr.pt.toLowerCase().includes(query) ||
      expr.en.toLowerCase().includes(query) ||
      (expr.context && expr.context.toLowerCase().includes(query)) ||
      (expr.tone && expr.tone.toLowerCase().includes(query))
    );
  });

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif', backgroundColor: '#fff', color: '#000' }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>UNTRANSLATABLE</h1>

      <input
        type="text"
        placeholder="Buscar expressão..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ fontSize: 20, marginBottom: 32, padding: 8, width: '100%', maxWidth: 400 }}
      />

      {!user ? (
        <button onClick={login} style={{ marginBottom: 32 }}>Fazer login com Google</button>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
            <input
              type="text"
              placeholder="Inglês (en)"
              value={formData.en}
              onChange={(e) => setFormData({ ...formData, en: e.target.value })}
              required
              style={{ display: 'block', marginBottom: 8 }}
            />
            <input
              type="text"
              placeholder="Português (pt)"
              value={formData.pt}
              onChange={(e) => setFormData({ ...formData, pt: e.target.value })}
              required
              style={{ display: 'block', marginBottom: 8 }}
            />
            <input
              type="text"
              placeholder="Contexto (opcional)"
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              style={{ display: 'block', marginBottom: 8 }}
            />
            <input
              type="text"
              placeholder="Tom (opcional)"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              style={{ display: 'block', marginBottom: 8 }}
            />
            <button type="submit">Adicionar expressão</button>
            <button type="button" onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
          </form>
        </>
      )}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {filtered.map((expr, index) => (
          <div
            key={index}
            style={{
              padding: 16,
              border: '1px solid #ccc',
              borderRadius: 8,
              background: '#fafafa'
            }}
          >
            <strong>{expr.en}</strong> — {expr.pt}<br />
            <span style={{ fontSize: 14 }}>{expr.context}</span><br />
            <em style={{ fontSize: 12 }}>{expr.tone}</em>
          </div>
        ))}
      </div>
    </div>
  );
}
