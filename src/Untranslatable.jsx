// Untranslatable.jsx
import React, { useState, useEffect } from 'react';
import { auth, provider, firestore } from './firebase'; // Alterado para usar as novas exportações
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Certifique-se de importar o Firestore corretamente
import './styles.css';

export default function Untranslatable() {
  const [user, setUser] = useState(null);
  const [expressions, setExpressions] = useState([]);
  const [search, setSearch] = useState('');
  const [newExpression, setNewExpression] = useState({ en: '', pt: '', context: '', tone: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchExpressions = async () => {
      const querySnapshot = await getDocs(collection(firestore, "expressions"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpressions(data);
    };
    fetchExpressions();
  }, []);

  const handleAdd = async () => {
    if (!newExpression.en || !newExpression.pt) return;
    const docRef = await addDoc(collection(firestore, 'expressions'), newExpression);
    setExpressions(prev => [...prev, { id: docRef.id, ...newExpression }]);
    setNewExpression({ en: '', pt: '', context: '', tone: '' });
  };

  const filtered = expressions.filter(expr =>
    [expr.en, expr.pt, expr.context, expr.tone].some(field =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold text-black mb-2">UNTRANSLATABLE</h1>
      <p className="text-lg text-gray-600 mb-6">
        Porque algumas palavras não cabem em duas línguas — e tudo bem.
      </p>

      <input
        type="text"
        placeholder="Buscar por expressão, tradução ou contexto..."
        className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {!user ? (
        <div className="alert">
          <p>
            ⚠️ É necessário fazer login para adicionar novas expressões.
          </p>
          <button
            onClick={() => signInWithPopup(auth, provider)}
            className="alert-button mt-3"
          >
            Login com Google
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-xl shadow mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Adicionar nova expressão</h2>
            <p className="text-sm text-gray-500">Logado como: {user.displayName || user.email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Inglês (en)"
              value={newExpression.en}
              onChange={e => setNewExpression({ ...newExpression, en: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Português (pt)"
              value={newExpression.pt}
              onChange={e => setNewExpression({ ...newExpression, pt: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Contexto (opcional)"
              value={newExpression.context}
              onChange={e => setNewExpression({ ...newExpression, context: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Tom (opcional)"
              value={newExpression.tone}
              onChange={e => setNewExpression({ ...newExpression, tone: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mt-4 flex justify-start items-center gap-4">
            <button
              onClick={handleAdd}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Adicionar expressão
            </button>
            <button
              onClick={() => signOut(auth)}
              className="text-red-600 hover:underline text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(expr => (
          <div key={expr.id} className="card">
            <h3>{expr.en}</h3>
            <p>{expr.pt}</p>
            {expr.context && <p className="context">{expr.context}</p>}
            {expr.tone && <p className="tone">{expr.tone}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}