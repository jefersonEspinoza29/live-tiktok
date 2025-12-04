// src/App.jsx
import { useMemo, useState } from 'react';
import RegistroParticipante from './components/RegistroParticipante';
import Sorteo from './components/Sorteo';
import './App.css';

// Lee ?live=algo del enlace. Ejemplo: https://tusorteos.com?live=navidad2025
function useLiveId() {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'demo_live';
    const params = new URLSearchParams(window.location.search);
    return params.get('live') || 'demo_live';
  }, []);
}

function App() {
  const [modo, setModo] = useState('participante'); // 'participante' | 'sorteo'
  const liveId = useLiveId();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sorteo del Live 🎁</h1>
        <p>Regístrate y mira en vivo quién gana el sorteo.</p>

        <div className="mode-switch">
          <button
            className={modo === 'participante' ? 'active' : ''}
            onClick={() => setModo('participante')}
          >
            Soy participante
          </button>
          <button
            className={modo === 'sorteo' ? 'active' : ''}
            onClick={() => setModo('sorteo')}
          >
            Ver sorteo (host)
          </button>
        </div>

        <p className="live-tag">
          Live ID: <strong>{liveId}</strong>
        </p>
      </header>

      <main className="app-main">
        {modo === 'participante' ? (
          <RegistroParticipante liveId={liveId} />
        ) : (
          <Sorteo liveId={liveId} />
        )}
      </main>

      <footer className="app-footer">
        <small>Powered by React + Supabase · TikTok Live</small>
      </footer>
    </div>
  );
}

export default App;
