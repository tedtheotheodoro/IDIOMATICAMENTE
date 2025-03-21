import { useState } from 'react';

const expressions = [
  { en: "Big deal.", pt: "Grande coisa.", tone: "Sarcástico", context: "Desdém ou ironia", example: "So you won a medal. Big deal." },
  { en: "Get over yourself.", pt: "Desce do salto.", tone: "Informal / Sarcástico", context: "Alguém convencido ou arrogante", example: "You think everyone loves you? Get over yourself." },
  { en: "You wish.", pt: "Até parece.", tone: "Informal / Sarcástico", context: "Ironia diante de desejo improvável", example: "Me? Jealous of you? You wish." }
];

export default function Untranslatable() {
  const [search, setSearch] = useState("");

  const filtered = expressions.filter(expr => {
    const query = search.toLowerCase();
    return (
      expr.en.toLowerCase().includes(query) ||
      expr.pt.toLowerCase().includes(query) ||
      expr.context.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 32 }}>UNTRANSLATABLE</h1>
      <input
        placeholder="Buscar expressão..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: 8, width: '100%', marginBottom: 16 }}
      />
      {filtered.map((expr, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <strong>{expr.en}</strong> — <em>{expr.pt}</em><br />
          <small>{expr.context} | {expr.tone}</small><br />
          <span>Ex: {expr.example}</span>
        </div>
      ))}
    </div>
  );
}