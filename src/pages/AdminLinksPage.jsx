// src/pages/AdminLinksPage.jsx
import { useMemo, useState } from 'react';

const HOST_PATH = import.meta.env.VITE_SORTEO_HOST_PATH || '/host-super-secreto';

function AdminLinksPage() {
  const [codigo, setCodigo] = useState('demo_live');
  const [copiado, setCopiado] = useState(null); // 'participar' | 'host' | null

  const baseUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.origin; // ej. http://localhost:5173
  }, []);

  const linkParticipar = `${baseUrl}/participar?live=${codigo}`;
  const linkHost = `${baseUrl}${HOST_PATH}?live=${codigo}`;

  const copyToClipboard = async (texto, tipo) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(tipo);
      setTimeout(() => setCopiado(null), 2000);
    } catch (error) {
      console.error('Error copiando al portapapeles:', error);
    }
  };

  return (
    <div className="app-container admin-links-page">
      <header className="app-header admin-links-header">
        <div className="live-pill">
          <span className="live-dot" />
          Panel interno · Generador de links
        </div>

        <h1>Generador de links de sorteo</h1>
        <p className="admin-links-subheading">
          Escribe un código para el live y copia los enlaces listos para compartir.
        </p>
      </header>

      <main className="app-main admin-links-main">
        <section className="card admin-links-card">
          <label>
            Código del live
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="navidad_2025"
            />
            <span className="admin-links-hint">
              Evita espacios. Puedes usar guiones o guion bajo: ejemplo{' '}
              <code>hallowen_2025</code>.
            </span>
          </label>

          <div className="admin-link-row">
            <div className="admin-link-text">
              <p>
                <strong>Link participantes:</strong>
              </p>
              <code>{linkParticipar}</code>
            </div>
            <button
              type="button"
              className="copy-btn"
              onClick={() => copyToClipboard(linkParticipar, 'participar')}
            >
              {copiado === 'participar' ? 'Copiado ✓' : 'Copiar'}
            </button>
          </div>

          <div className="admin-link-row">
            <div className="admin-link-text">
              <p>
                <strong>Link host (no compartir):</strong>
              </p>
              <code>{linkHost}</code>
            </div>
            <button
              type="button"
              className="copy-btn copy-btn-danger"
              onClick={() => copyToClipboard(linkHost, 'host')}
            >
              {copiado === 'host' ? 'Copiado ✓' : 'Copiar'}
            </button>
          </div>

          <p className="admin-links-note">
            🔐 <strong>Nota:</strong> el link del host es solo para ti o el cliente que
            manejará el sorteo. No lo pongas en la descripción del live.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AdminLinksPage;
