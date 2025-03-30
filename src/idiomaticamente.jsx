import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function Idiomaticamente() {
  const [expressions, setExpressions] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      <input
        type="text"
        placeholder="Search expression..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {filteredExpressions.length === 0 ? (
        <p>No expressions found.</p>
      ) : (
        <div style={styles.grid}>
          {filteredExpressions.map((expr) => (
            <div key={expr.id} style={styles.card}>
              <p style={styles.expression}>
                <strong>{expr.en}</strong> — {expr.pt}
              </p>
              {expr.context && <p style={styles.context}>{expr.context}</p>}
              {expr.tone && <p style={styles.tone}>{expr.tone}</p>}
            </div>
          ))}
        </div>
      )}
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
  },
  title: {
    fontSize: 32,
    marginBottom: 16
  },
  searchInput: {
    padding: 8,
    marginBottom: 24,
    fontSize: 16,
    width: '100%',
    maxWidth: 400,
    border: '1px solid #ccc',
    borderRadius: 8,
  },
  grid: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  },
  card: {
    padding: 16,
    border: '1px solid #ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  expression: {
    margin: 0
  },
  context: {
    marginTop: 8,
    fontSize: 14
  },
  tone: {
    marginTop: 4,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
  }
};