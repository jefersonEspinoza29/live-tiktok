// src/pages/HostPage.jsx
import { useState, useEffect } from 'react';
import Sorteo from '../components/Sorteo';
import { useLiveId } from '../hooks/useLiveId';

const ADMIN_PIN = import.meta.env.VITE_SORTEO_ADMIN_PIN;

function HostPage() {
  const liveId = useLiveId();
  const [pinIngresado, setPinIngresado] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [error, setError] = useState('');

  const manejarLogin = (e) => {
    e.preventDefault();
    if (pinIngresado === ADMIN_PIN) {
      setAutenticado(true);
      setError('');
      localStorage.setItem('sorteo_admin_logueado', '1');
    } else {
      setError('PIN incorrecto');
    }
  };

  // Al cargar, si ya está logueado en esta PC, auto-entra
  useEffect(() => {
    const yaLogueado = localStorage.getItem('sorteo_admin_logueado') === '1';
    if (yaLogueado) {
      setAutenticado(true);
    }
  }, []);

  return (
    <div className="app-container host-page">
      <header className="app-header host-header">
        <div className="live-pill">
          <span className="live-dot" />
          Panel del host · Solo administradores
        </div>

        <h1>Panel de sorteo 🎥</h1>
        <p className="host-subheading">
          Usa esta pantalla para mostrar el sorteo en el directo. No compartas este
          enlace ni el PIN.
        </p>

        <div className="live-meta">
          <span className="live-meta-label">Código del sorteo</span>
          <span className="live-tag-badge">
            <strong>{liveId}</strong>
          </span>
        </div>
      </header>

      <main
        className={`app-main host-main ${
          autenticado ? 'host-main-auth' : 'host-main-login'
        }`}
      >
        {!autenticado ? (
          <section className="card host-login-card">
            <h2>Acceso admin</h2>
            <p>Introduce el PIN del sorteo para entrar al panel.</p>
            <form className="form" onSubmit={manejarLogin}>
              <label>
                PIN
                <input
                  type="password"
                  value={pinIngresado}
                  onChange={(e) => setPinIngresado(e.target.value)}
                  placeholder="••••"
                />
              </label>
              <button type="submit">Entrar al panel</button>
            </form>
            {error && <p className="message">{error}</p>}
          </section>
        ) : (
          <Sorteo liveId={liveId} />
        )}
      </main>

      <footer className="app-footer host-footer">
        <small>Panel host · No compartir este enlace ni el PIN</small>
      </footer>
    </div>
  );
}

export default HostPage;
