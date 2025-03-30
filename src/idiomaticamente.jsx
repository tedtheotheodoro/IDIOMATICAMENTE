import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db, provider } from './firebaseConfig';

export default function Idiomaticamente() {
  // Estados
  const [expressions, setExpressions] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [newExpression, setNewExpression] = useState({
    en: '',
    pt: '',
    context: '',
    tone: ''
  });

  // Efeitos
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchExpressions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'expressions'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setExpressions(data);
      } catch (error) {
        console.error('Erro ao buscar expressões:', error);
        setError('Falha ao carregar expressões. Tente recarregar.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpressions();
  }, []);

  // Handlers
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Erro no login:', error);
      alert(`Falha no login: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const handleAddExpression = async () => {
    if (!newExpression.en || !newExpression.pt) return;
    
    try {
      const docRef = await addDoc(collection(db, 'expressions'), newExpression);
      setExpressions(prev => [...prev, { id: docRef.id, ...newExpression }]);
      setNewExpression({ en: '', pt: '', context: '', tone: '' });
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      setError('Falha ao adicionar expressão.');
    }
  };

  const filteredExpressions = expressions.filter((expr) => {
    const query = search.toLowerCase();
    return (
      expr.en?.toLowerCase().includes(query) ||
      expr.pt?.toLowerCase().includes(query) ||
      expr.context?.toLowerCase().includes(query) ||
      expr.tone?.toLowerCase().includes(query)
    );
  });

  // Estilos COMPLETOS (idênticos aos originais)
  const styles = {
    container: {
      padding: 24,
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#fff',
      color: '#000',
      minHeight: '100vh',
      maxWidth: 1200,
      margin: '0 auto',
    },
    title: {
      fontSize: 32,
      marginBottom: 8,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 18,
      color: '#666',
      marginBottom: 24,
    },
    disclaimer: {
      backgroundColor: '#f5f5f5',
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      textAlign: 'center',
      border: '1px solid #e0e0e0',
    },
    disclaimerText: {
      fontSize: 14,
      color: '#555',
      margin: 0,
      lineHeight: 1.5,
    },
    disclaimerHighlight: {
      fontWeight: 'bold',
      color: '#333',
    },
    searchInput: {
      padding: 12,
      marginBottom: 24,
      fontSize: 16,
      width: '100%',
      border: '1px solid #ddd',
      borderRadius: 8,
      boxSizing: 'border-box',
      maxWidth: 600,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    loginAlert: {
      backgroundColor: '#fff8e1',
      border: '1px solid #ffe082',
      padding: 16,
      borderRadius: 8,
      marginBottom: 24,
    },
    loginAlertText: {
      color: '#5d4037',
      fontWeight: '500',
      margin: '0 0 12px 0',
    },
    loginButton: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: 6,
      border: 'none',
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: '600',
      transition: 'background-color 0.2s',
    },
    addExpressionContainer: {
      backgroundColor: '#fafafa',
      padding: 24,
      borderRadius: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: 24,
      border: '1px solid #eee',
    },
    addExpressionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    addExpressionTitle: {
      fontSize: 20,
      fontWeight: '600',
      margin: 0,
      color: '#333',
    },
    userInfo: {
      fontSize: 12,
      color: '#666',
    },
    inputGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 16,
      marginBottom: 16,
    },
    input: {
      padding: 10,
      border: '1px solid #ddd',
      borderRadius: 4,
      fontSize: 14,
      height: 40,
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    },
    addButton: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: 6,
      border: 'none',
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: '600',
    },
    logoutButton: {
      color: '#d32f2f',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 14,
      textDecoration: 'underline',
    },
    grid: {
      display: 'grid',
      gap: 16,
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    },
    card: {
      padding: 20,
      border: '1px solid #eee',
      borderRadius: 12,
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
    },
    expressionEnglish: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      margin: '0 0 8px 0',
    },
    expressionPortuguese: {
      fontSize: 16,
      color: '#000',
      margin: '0 0 12px 0',
      lineHeight: 1.4,
    },
    context: {
      fontSize: 14,
      color: '#555',
      fontStyle: 'italic',
      margin: '8px 0 0 0',
      lineHeight: 1.5,
    },
    tone: {
      fontSize: 12,
      color: '#777',
      margin: '4px 0 0 0',
    },
    loadingText: {
      color: '#666',
      textAlign: 'center',
      margin: '40px 0',
    },
    errorText: {
      color: '#d32f2f',
      textAlign: 'center',
      margin: '40px 0',
    },
    emptyText: {
      color: '#666',
      textAlign: 'center',
      margin: '40px 0',
    }
  };

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <h1 style={styles.title}>IDIOMATICAMENTE</h1>
      <p style={styles.subtitle}>Porque algumas expressões não cabem em duas línguas — e tudo bem.</p>

      {/* Aviso de login */}
      <div style={styles.disclaimer}>
        <p style={styles.disclaimerText}>
          Para adicionar novas expressões ao banco de dados, faça login.
          <br />
          <span style={styles.disclaimerHighlight}>Log in to add more expressions to our database.</span>
        </p>
      </div>

      {/* Barra de busca */}
      <input
        type="text"
        placeholder="Buscar por expressão, tradução ou contexto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {/* Seção de autenticação */}
      {!user ? (
        <div style={styles.loginAlert}>
          <p style={styles.loginAlertText}>⚠️ É necessário fazer login para adicionar novas expressões.</p>
          <button
            onClick={handleLogin}
            style={styles.loginButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#000'}
          >
            Login com Google
          </button>
        </div>
      ) : (
        <div style={styles.addExpressionContainer}>
          <div style={styles.addExpressionHeader}>
            <h2 style={styles.addExpressionTitle}>Adicionar nova expressão</h2>
            <p style={styles.userInfo}>Logado como: {user.displayName || user.email}</p>
          </div>
          
          {/* Formulário */}
          <div style={styles.inputGrid}>
            <input
              type="text"
              placeholder="Inglês (en)"
              value={newExpression.en}
              onChange={(e) => setNewExpression({ ...newExpression, en: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Português (pt)"
              value={newExpression.pt}
              onChange={(e) => setNewExpression({ ...newExpression, pt: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Contexto (opcional)"
              value={newExpression.context}
              onChange={(e) => setNewExpression({ ...newExpression, context: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Tom (opcional)"
              value={newExpression.tone}
              onChange={(e) => setNewExpression({ ...newExpression, tone: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.buttonContainer}>
            <button
              onClick={handleAddExpression}
              style={styles.addButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#000'}
            >
              Adicionar expressão
            </button>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Lista de expressões */}
      {isLoading ? (
        <p style={styles.loadingText}>Carregando expressões...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : filteredExpressions.length === 0 ? (
        <p style={styles.emptyText}>Nenhuma expressão encontrada.</p>
      ) : (
        <div style={styles.grid}>
          {filteredExpressions.map((expr) => (
            <div key={expr.id} style={styles.card}>
              <h3 style={styles.expressionEnglish}>{expr.en}</h3>
              <p style={styles.expressionPortuguese}>{expr.pt}</p>
              {expr.context && <p style={styles.context}>{expr.context}</p>}
              {expr.tone && <p style={styles.tone}>{expr.tone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}