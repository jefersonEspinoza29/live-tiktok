// src/components/RegistroParticipante.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

function RegistroParticipante({ liveId }) {
  const [form, setForm] = useState({
    nombre: '',
    tiktok_user: '',
    celular: '',
    correo: '',
    acepta_reglas: false,
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Nombre
    const nombre = form.nombre.trim();
    if (!nombre) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    } else if (nombre.length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    // Usuario TikTok
    const usuario = form.tiktok_user.trim().replace(/^@+/, '').toLowerCase();
    const regexTikTok = /^[a-z0-9._]{3,24}$/;
    if (!usuario) {
      nuevosErrores.tiktok_user = 'El usuario de TikTok es obligatorio.';
    } else if (!regexTikTok.test(usuario)) {
      nuevosErrores.tiktok_user =
        'Usuario inválido. Usa solo letras, números, punto o guion bajo (3–24 caracteres).';
    }

    // Celular (opcional, pero si hay, que sea válido)
    const celular = form.celular.trim();
    if (celular && !/^\d{9}$/.test(celular)) {
      // Para Perú: 9 dígitos. Cambia si quieres otro formato.
      nuevosErrores.celular = 'Ingresa un número de celular válido (9 dígitos).';
    }

    // Correo (opcional, pero si hay, que sea válido)
    const correo = form.correo.trim();
    if (correo) {
      // Regex simple, suficiente para validar formato básico
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexCorreo.test(correo)) {
        nuevosErrores.correo = 'Ingresa un correo electrónico válido.';
      }
    }

    // Aceptar reglas
    if (!form.acepta_reglas) {
      nuevosErrores.acepta_reglas =
        'Debes aceptar las reglas del sorteo para participar.';
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setErrores({});

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    // Limpiar usuario (quitar @ y espacios)
    const usuarioNormalizado = form.tiktok_user
      .trim()
      .replace(/^@+/, '')
      .toLowerCase();

    setLoading(true);

    const { error } = await supabase.from('participantes_sorteo').insert([
      {
        nombre: form.nombre.trim(),
        tiktok_user: usuarioNormalizado,
        celular: form.celular.trim() || null,
        correo: form.correo.trim() || null,
        live_id: liveId,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      if (error.code === '23505') {
        setMensaje(
          'Ya estás registrado en este sorteo con ese usuario de TikTok. ✨'
        );
      } else {
        setMensaje(
          'Ocurrió un error al registrar tu participación. Inténtalo de nuevo en unos segundos.'
        );
      }
      return;
    }

    setMensaje('✅ ¡Te registraste correctamente! Mucha suerte en el sorteo.');
    setForm({
      nombre: '',
      tiktok_user: '',
      celular: '',
      correo: '',
      acepta_reglas: false,
    });
  };

  return (
    <section className="card">
      <h2>Regístrate en el sorteo</h2>
      <p>Completa tus datos tal como aparecen en TikTok para poder verificarte.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nombre completo *
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Juan Perez"
          />
          {errores.nombre && <span className="input-error">{errores.nombre}</span>}
        </label>

        <label>
          Usuario de TikTok *
          <input
            type="text"
            name="tiktok_user"
            value={form.tiktok_user}
            onChange={handleChange}
            placeholder="@mi_usuario_tiktok"
          />
          {errores.tiktok_user && (
            <span className="input-error">{errores.tiktok_user}</span>
          )}
        </label>

        <label>
          Celular (opcional)
          <input
            type="tel"
            name="celular"
            value={form.celular}
            onChange={handleChange}
            placeholder="Ej. 987654321"
          />
          {errores.celular && (
            <span className="input-error">{errores.celular}</span>
          )}
        </label>

        <label>
          Correo (opcional)
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="tucorreo@example.com"
          />
          {errores.correo && (
            <span className="input-error">{errores.correo}</span>
          )}
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="acepta_reglas"
            checked={form.acepta_reglas}
            onChange={handleChange}
          />
          <span>
            Acepto las reglas del sorteo y que mis datos se usen solo para este
            evento.
          </span>
        </label>
        {errores.acepta_reglas && (
          <span className="input-error">{errores.acepta_reglas}</span>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Participar en el sorteo'}
        </button>
      </form>

      {mensaje && <p className="message">{mensaje}</p>}
    </section>
  );
}

export default RegistroParticipante;
