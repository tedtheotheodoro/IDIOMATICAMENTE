// Componente principal do app UNTRANSLATABLE com melhorias visuais, usabilidade e responsividade + aviso de login obrigatório

import React, { useState, useEffect } from 'react';
import { auth, firestore, firebase, provider } from './firebase';
import { signOut, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function Untranslatable() {
  const [user, setUser] = useState(null);
  const [expressions, setExpressions] = useState([]);
  const [search, setSearch] = useState('');
  const [newExpression, setNewExpression] = useState({
    en: '',
    pt: '',
    context: '',
    tone: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchExpressions = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'expressions'));
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

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold text-purple-600 underline">UNTRANSLATABLE</h1>
      <p className="text-lg text-gray-600 mt-1 mb-6">
        Porque algumas palavras não cabem em duas línguas — e tudo bem.
      </p>

      <input
        type="text"
        placeholder="Buscar por expressão, tradução ou contexto..."
        className="w-full mb-6 p-2 border border-gray-300 rounded-md"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {!user ? (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-xl mb-8">
          <p className="text-yellow-800 font-medium">
            ⚠️ É necessário fazer login para adicionar novas expressões.
          </p>
          <button
            onClick={handleLogin}
            className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Login com Google
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-xl shadow mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Adicionar nova expressão</h2>
            <p className="text-sm text-gray-500">Logado como: {user.displayName || user.email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">Inglês (en)</label>
              <input
                type="text"
                value={newExpression.en}
                onChange={e => setNewExpression({ ...newExpression, en: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Português (pt)</label>
              <input
                type="text"
                value={newExpression.pt}
                onChange={e => setNewExpression({ ...newExpression, pt: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Contexto (opcional)</label>
              <input
                type="text"
                value={newExpression.context}
                onChange={e => setNewExpression({ ...newExpression, context: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Tom (opcional)</label>
              <input
                type="text"
                value={newExpression.tone}
                onChange={e => setNewExpression({ ...newExpression, tone: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Adicionar expressão
          </button>
          <button
            onClick={() => signOut(auth)}
            className="ml-4 mt-4 text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(expr => (
          <div
            key={expr.id}
            className="border p-4 rounded-2xl shadow-sm bg-white hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold mb-1">{expr.en}</h3>
            <p className="text-lg text-gray-800 mb-2">{expr.pt}</p>
            {expr.context && <p className="text-sm text-gray-600 italic">{expr.context}</p>}
            {expr.tone && <p className="text-xs text-gray-500 mt-1">{expr.tone}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}


