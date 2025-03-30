import { useEffect, useState } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc 
} from 'firebase/firestore';
import { 
  auth, 
  db 
} from './firebaseConfig';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

export default function Idiomaticamente() {
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

  // Authentication state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Fetch expressions
  useEffect(() => {
    const fetchExpressions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'expressions'));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setExpressions(data);
      } catch (err) {
        console.error('Error fetching expressions:', err);
        setError('Failed to load expressions. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpressions();
  }, []);

  const handleAddExpression = async () => {
    if (!newExpression.en || !newExpression.pt) return;
    
    try {
      const docRef = await addDoc(collection(db, 'expressions'), newExpression);
      setExpressions(prev => [...prev, { id: docRef.id, ...newExpression }]);
      setNewExpression({ en: '', pt: '', context: '', tone: '' });
    } catch (err) {
      console.error('Error adding document:', err);
      setError('Failed to add expression. Please try again.');
    }
  };

  const filteredExpressions = expressions.filter((expr) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      expr.en?.toLowerCase().includes(query) ||
      expr.pt?.toLowerCase().includes(query) ||
      expr.context?.toLowerCase().includes(query) ||
      expr.tone?.toLowerCase().includes(query)
    );
  });

  const handleLogin = () => signInWithPopup(auth, provider);
  const handleLogout = () => signOut(auth);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>IDIOMATICAMENTE</h1>
        <p>Loading expressions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>IDIOMATICAMENTE</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>IDIOMATICAMENTE</h1>
      <p style={styles.subtitle}>Porque algumas palavras não cabem em duas línguas — e tudo bem.</p>
      
      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        <p style={styles.disclaimerText}>
          Para adicionar novas expressões ao banco de dados, faça login.
          <br />
          <span style={styles.disclaimerHighlight}>Log in to add more expressions to our database.</span>
        </p>
      </div>

      <input
        type="text"
        placeholder="Buscar por expressão, tradução ou contexto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {!user ? (
        <div style={styles.loginAlert}>
          <p style={styles.loginAlertText}>⚠️ É necessário fazer login para adicionar novas expressões.</p>
          <button
            onClick={handleLogin}
            style={styles.loginButton}
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

      <div style={styles.grid}>
        {filteredExpressions.length === 0 ? (
          <p>Nenhuma expressão encontrada.</p>
        ) : (
          filteredExpressions.map((expr) => (
            <div key={expr.id} style={styles.card}>
              <h3 style={styles.expressionEnglish}>{expr.en}</h3>
              <p style={styles.expressionPortuguese}>{expr.pt}</p>
              {expr.context && <p style={styles.context}>{expr.context}</p>}
              {expr.tone && <p style={styles.tone}>{expr.tone}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
  },
  disclaimerText: {
    fontSize: 14,
    color: '#555',
    margin: 0,
  },
  disclaimerHighlight: {
    fontWeight: 'bold',
  },
  searchInput: {
    padding: 12,
    marginBottom: 24,
    fontSize: 16,
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: 8,
    boxSizing: 'border-box',
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
    padding: '8px 16px',
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
  },
  addExpressionContainer: {
    backgroundColor: '#fafafa',
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: 24,
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
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  addButton: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
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
    transition: 'box-shadow 0.2s',
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
  },
  context: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    margin: '8px 0 0 0',
  },
  tone: {
    fontSize: 12,
    color: '#777',
    margin: '4px 0 0 0',
  },
};