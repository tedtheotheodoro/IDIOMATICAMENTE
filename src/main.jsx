import React from 'react';
import ReactDOM from 'react-dom/client';
import idiomaticamente from './idiomaticamente'; // Se necessário, o import pode ser ajustado
import './index.css'; // Importa o Tailwind!
import IDIOMATICAMENTE from './idiomaticamente'; // Se necessário, o import pode ser ajustado

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Título centralizado ao topo */}
    <h1 id="title">IDIOMATICAMENTE</h1>
    {/* Componente idiomaticamente */}
    <IDIOMATICAMENTE />
  </React.StrictMode>,
);
