// src/components/Sorteo.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Sorteo({ liveId }) {
  const [participantes, setParticipantes] = useState([]);
  const [ganadores, setGanadores] = useState([]);
  const [ganadorActual, setGanadorActual] = useState(null);
  const [loading, setLoading] = useState(false);

  // Config de "a la X gana"
  const [roundsToWin, setRoundsToWin] = useState(1);
  const [currentRound, setCurrentRound] = useState(0);

  // Overlay a pantalla completa
  const [overlayWinner, setOverlayWinner] = useState(null);

  const cargarDatos = async () => {
    // Participantes
    const { data: part, error: err1 } = await supabase
      .from('participantes_sorteo')
      .select('*')
      .eq('live_id', liveId)
      .order('created_at', { ascending: true });

    if (!err1 && part) setParticipantes(part || []);

    // Ganadores
    const { data: gan, error: err2 } = await supabase
      .from('participantes_sorteo')
      .select('*')
      .eq('live_id', liveId)
      .eq('es_ganador', true)
      .order('created_at', { ascending: true });

    if (!err2 && gan) setGanadores(gan || []);
  };

  useEffect(() => {
    if (!liveId) return;
    cargarDatos();
  }, [liveId]);

  const handleRoundsChange = (e) => {
    const value = Number(e.target.value) || 1;
    setRoundsToWin(value);
    setCurrentRound(0);
  };

  const cerrarOverlay = () => {
    setOverlayWinner(null);
  };

  const sortearGanador = async () => {
    if (loading) return; // evita doble clic
    if (participantes.length === 0) {
      alert('No hay participantes registrados en este sorteo.');
      return;
    }

    const disponibles = participantes.filter((p) => !p.es_ganador);
    if (disponibles.length === 0) {
      alert('Ya no hay participantes disponibles para sortear (todos han ganado).');
      return;
    }

    setLoading(true);
    setOverlayWinner(null);

    // Elegimos el ganador final (justo) desde los disponibles
    const finalIndex = Math.floor(Math.random() * disponibles.length);
    const finalWinner = disponibles[finalIndex];

    // Animación tipo ruleta: mostrar nombres aleatorios unos segundos
    const totalSteps = 25; // cuántos "saltos" de nombres
    for (let i = 0; i < totalSteps; i++) {
      const random = disponibles[Math.floor(Math.random() * disponibles.length)];
      setGanadorActual(random);
      // un poco más rápido al inicio y más lento al final
      const delay = 60 + i * 15;
      await sleep(delay);
    }

    // Al final, mostramos el ganador pre-seleccionado
    setGanadorActual(finalWinner);

    // Actualizamos intento
    const newRound = currentRound + 1;
    setCurrentRound(newRound);

    // Si todavía no es el intento que "gana", solo mostramos pero no lo guardamos
    if (newRound < roundsToWin) {
      setLoading(false);
      return;
    }

    // Llegamos al intento ganador -> guardar en BD
    const { error } = await supabase
      .from('participantes_sorteo')
      .update({ es_ganador: true })
      .eq('id', finalWinner.id);

    if (error) {
      console.error('❌ Error actualizando ganador:', error);
      alert('Ocurrió un error al guardar el ganador.');
      setLoading(false);
      return;
    }

    // Actualizar estado local
    setGanadores((prev) => [...prev, { ...finalWinner, es_ganador: true }]);
    setParticipantes((prev) =>
      prev.map((p) =>
        p.id === finalWinner.id ? { ...p, es_ganador: true } : p
      )
    );

    // Mostrar overlay a pantalla completa
    setOverlayWinner(finalWinner);

    // Reiniciar contador para la próxima "ronda"
    setCurrentRound(0);
    setLoading(false);
  };

  return (
    <>
      {/* OVERLAY A PANTALLA COMPLETA CON CONFETI */}
      {overlayWinner && (
        <div className="winner-overlay">
          <div className="winner-overlay-inner">
            <div className="confetti-layer">
              {Array.from({ length: 25 }).map((_, i) => (
                <span key={i} className="confetti-piece" />
              ))}
            </div>

            <div className="winner-overlay-content">
              <div className="winner-overlay-emoji">🎉🎉🎉</div>
              <p className="winner-overlay-title">¡Ganador del sorteo!</p>
              <h2 className="winner-overlay-name">{overlayWinner.nombre}</h2>
              <h3 className="winner-overlay-user">
                @{overlayWinner.tiktok_user}
              </h3>
              <p className="winner-overlay-subtitle">
                Felicitaciones para el ganador toma una captura 📸
              </p>

              <button
                type="button"
                className="winner-overlay-close"
                onClick={cerrarOverlay}
              >
                Cerrar y seguir sorteando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANEL PRINCIPAL */}
      <section className="card sorteo-card">
        <h2>Panel del sorteo (para el live)</h2>
        <p className="sorteo-subheading">
          Proyecta esta pantalla en tu directo. Ajusta cuántos intentos quieres antes
          de que salga el ganador definitivo y deja que la ruleta haga su magia.
        </p>

        {/* Dashboard superior */}
        <div className="stats stats-host">
          <div>
            <span>Total inscritos</span>
            <strong>{participantes.length}</strong>
          </div>
          <div>
            <span>Ganadores</span>
            <strong>{ganadores.length}</strong>
          </div>
          <div className="round-controls">
            <label>
              Gana al intento:
              <select value={roundsToWin} onChange={handleRoundsChange}>
                <option value={1}>1° intento</option>
                <option value={3}>3° intento</option>
                <option value={5}>5° intento</option>
              </select>
            </label>
            <div className="round-info">
              Intento actual:{' '}
              <strong>
                {currentRound}/{roundsToWin}
              </strong>
            </div>
          </div>
          <button onClick={cargarDatos} className="btn-refresh">
            Actualizar lista ↻
          </button>
        </div>

        <div className="grid-layout">
          {/* Lista de participantes */}
          <div className="participantes-list">
            <h3>Participantes</h3>
            <ul>
              {participantes.map((p) => (
                <li key={p.id} className={p.es_ganador ? 'winner' : ''}>
                  <span>{p.nombre}</span>
                  <span className="user">@{p.tiktok_user}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Panel de ganador + historial grande */}
          <div className="ganador-panel">
            <h3>Ruleta de nombres</h3>
            {ganadorActual ? (
              <div className={`winner-box ${loading ? 'animating' : ''}`}>
                <p>
                  {currentRound === 0 || currentRound === roundsToWin
                    ? '🎉 ¡Ganador oficial!'
                    : '🎲 Intento de ruleta'}
                </p>
                <h2>{ganadorActual.nombre}</h2>
                <h3>@{ganadorActual.tiktok_user}</h3>
                {currentRound > 0 && currentRound < roundsToWin && (
                  <p className="winner-hint">
                    Aún no es el intento #{roundsToWin}. Sigue sorteando...
                  </p>
                )}
              </div>
            ) : (
              <div className="winner-box placeholder">
                <p>Presiona “SORTEAR” para empezar la ruleta.</p>
              </div>
            )}

            <button
              className="btn-sorteo"
              onClick={sortearGanador}
              disabled={loading}
            >
              {loading ? 'Sorteando...' : 'SORTEAR'}
            </button>

            {ganadores.length > 0 && (
              <div className="ganadores-historial">
                <div className="ganadores-header">
                  <h4>Historial de ganadores</h4>
                  <span>{ganadores.length} ganadores</span>
                </div>
                <div className="ganadores-scroll">
                  <ol>
                    {ganadores.map((g, idx) => (
                      <li key={g.id}>
                        <span className="ganador-index">#{idx + 1}</span>
                        <span className="ganador-name">
                          {g.nombre} – @{g.tiktok_user}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Sorteo;
