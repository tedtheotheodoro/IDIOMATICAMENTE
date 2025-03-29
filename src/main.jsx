import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import IDIOMATICAMENTE from './idiomaticamente';
import './index.css'; // Importa o Tailwind!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="text-center">
      <h1 id="title">IDIOMATICAMENTE</h1>
      <p id="subtitle">Porque algumas expressões não cabem em duas línguas — e tudo bem.</p>
    </div>
    {/* Componente idiomaticamente */}
    <IDIOMATICAMENTE />
  </React.StrictMode>,
)

