// src/Untranslatable.jsx
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { auth, login, logout, onUserChange } from './firebaseAuth';

export default function Untranslatable() {
  const [expressions, setExpressions] = useState([]);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ en: '', pt: '', context: '', tone: '' });

  useEffect(() => {
    const unsubscribe = onUserChange(setUser);
    return () => unsubscribe();
  }, []);

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
      expr.pt.toLowerCase().includes(query) ||
      expr.en.toLowerCase().includes(query) ||
      (expr.context && expr.context.toLowerCase().includes(query)) ||
      (expr.tone && expr.tone.toLowerCase().includes(query))
    );
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'expressions'), formData);
      setFormData({ en: '', pt: '', context: '', tone: '' });
    } catch (error) {
      console.error('Erro ao enviar expressão:', error);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif', backgroundColor: '#fff', color: '#000' }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>UNTRANSLATABLE</h1>

      <input
        type="text"
        placeholder="Buscar expressão..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ fontSize: 20, padding: 8, width: '100%', maxWidth: 400, marginBottom: 24, border: '1px solid #ccc', borderRadius: 8 }}
      />

      {!user ? (
        <button onClick={login} style={{ padding: 12, fontSize: 16, borderRadius: 8, cursor: 'pointer' }}>Fazer login com Google</button>
      ) : (
        <>
          <p style={{ fontStyle: 'italic', marginBottom: 8 }}>Logado como {user.displayName || user.email}</p>
          <button onClick={logout} style={{ padding: 8, fontSize: 14, borderRadius: 6, marginBottom: 24 }}>Sair</button>

          <form onSubmit={handleSubmit} style={{ marginBottom: 40, maxWidth: 600 }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Nova expressão</h2>
            <input type="text" placeholder="Inglês" value={formData.en} onChange={(e) => setFormData({ ...formData, en: e.target.value })} style={{ display: 'block', marginBottom: 8, padding: 8, width: '100%' }} />
            <input type="text" placeholder="Português" value={formData.pt} onChange={(e) => setFormData({ ...formData, pt: e.target.value })} style={{ display: 'block', marginBottom: 8, padding: 8, width: '100%' }} />
            <input type="text" placeholder="Contexto" value={formData.context} onChange={(e) => setFormData({ ...formData, context: e.target.value })} style={{ display: 'block', marginBottom: 8, padding: 8, width: '100%' }} />
            <input type="text" placeholder="Tom (ex: informal)" value={formData.tone} onChange={(e) => setFormData({ ...formData, tone: e.target.value })} style={{ display: 'block', marginBottom: 8, padding: 8, width: '100%' }} />
            <button type="submit" style={{ padding: 10, borderRadius: 6, backgroundColor: '#000', color: '#fff' }}>Adicionar</button>
          </form>
        </>
      )}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {filtered.map((expr, index) => (
          <div key={index} style={{ padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
            <p><strong>{expr.en}</strong> — {expr.pt}</p>
            <p>{expr.context}</p>
            <p style={{ fontStyle: 'italic' }}>{expr.tone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}