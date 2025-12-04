// src/pages/ParticiparPage.jsx
import RegistroParticipante from '../components/RegistroParticipante';
import { useLiveId } from '../hooks/useLiveId';

function ParticiparPage() {
  const liveId = useLiveId();

  return (
    <div className="app-container participate-page">
      <header className="app-header participate-header">
        <div className="live-pill">
          <span className="live-dot" />
          En vivo · Sorteo TikTok
        </div>

        <h1>Sorteo del Live 🎁</h1>

        <p className="subheading">
          Ingresa tus datos y participa en el sorteo mientras ves el directo.
        </p>

        <p className="nota-verificacion">
          ⚠️ Escribe <strong>exactamente</strong> tu usuario de TikTok.
          <br />
          Si sales ganador, se verificará que el perfil exista y coincida con el
          del live.
        </p>

        <div className="live-meta">
          <span className="live-meta-label">Código del sorteo</span>
          <span className="live-tag-badge">
            <strong>{liveId}</strong>
          </span>
        </div>
      </header>

      <main className="app-main participate-main">
        <RegistroParticipante liveId={liveId} />
      </main>

      <footer className="app-footer participate-footer">
        <small>Powered by React + Supabase · TikTok Live</small>
      </footer>
    </div>
  );
}

export default ParticiparPage;
