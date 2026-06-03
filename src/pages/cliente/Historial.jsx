import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import ClienteLayout from '../../components/cliente/ClienteLayout'
import './Historial.css'

/* ── Helpers ── */
const ESTADO_CONFIG = {
  completado: { label: 'Completado', color: '#10B981', bg: '#D1FAE5' },
  cancelado:  { label: 'Cancelado',  color: '#EF4444', bg: '#FEE2E2' },
}

const TIPO_LABEL = {
  instalacion:    'Instalación',
  reparacion:     'Reparación',
  falla:          'Falla',
  desinstalacion: 'Desinstalación',
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

/* ── Íconos ── */
const HistIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const MapIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const CalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const QuoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
  </svg>
)

/* ── Estrellas de calificación ── */
function Estrellas({ calificacion }) {
  return (
    <div className="hist-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < calificacion ? 'hist-star active' : 'hist-star'}>★</span>
      ))}
      <span className="hist-stars-label">{calificacion}/5</span>
    </div>
  )
}

/* ── Filtros ── */
const FILTROS = [
  { id: 'todos',      label: 'Todos' },
  { id: 'completado', label: 'Completados' },
  { id: 'cancelado',  label: 'Cancelados' },
]

/* ══════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
   ══════════════════════════════════════════════════════════════ */
export default function Historial() {
  const { authHeaders } = useAuth()

  const [historial, setHistorial] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [filtro,    setFiltro]    = useState('todos')

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL
    fetch(`${API}/solicitudes/historial`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setHistorial(data.solicitudes || []))
      .catch(() => setError('No se pudo cargar el historial.'))
      .finally(() => setLoading(false))
  }, [])

  const filtrados = filtro === 'todos'
    ? historial
    : historial.filter(s => s.estado === filtro)

  return (
    <ClienteLayout titulo="Historial de Servicios">

      {/* Filtros + contador */}
      <div className="hist-topbar">
        <div className="hist-filtros">
          {FILTROS.map(f => (
            <button
              key={f.id}
              className={`hist-filtro ${filtro === f.id ? 'active' : ''}`}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
              {f.id === 'todos' && !loading && (
                <span className="hist-filtro-count">{historial.length}</span>
              )}
              {f.id !== 'todos' && !loading && (
                <span className="hist-filtro-count">
                  {historial.filter(s => s.estado === f.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Estados */}
      {loading && <div className="hist-loading">Cargando historial…</div>}
      {error   && <div className="hist-error">{error}</div>}

      {/* Vacío */}
      {!loading && !error && filtrados.length === 0 && (
        <div className="hist-empty">
          <div className="hist-empty-icon"><HistIcon /></div>
          <h3>
            {filtro === 'todos'
              ? 'Aún no tienes servicios registrados'
              : `No hay servicios ${filtro === 'completado' ? 'completados' : 'cancelados'}`}
          </h3>
          <p>Los servicios completados y cancelados aparecerán aquí.</p>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && filtrados.length > 0 && (
        <div className="hist-list">
          {filtrados.map(s => {
            const cfg = ESTADO_CONFIG[s.estado] || { label: s.estado, color: '#6B7280', bg: '#F3F4F6' }
            return (
              <div
                className={`hist-card ${s.estado === 'completado' ? 'hist-card--ok' : 'hist-card--cancel'}`}
                key={s.id}
              >
                {/* Header */}
                <div className="hist-card-top">
                  <div className="hist-card-left">
                    <span className="hist-card-tipo">{TIPO_LABEL[s.tipo] || s.tipo}</span>
                    <p className="hist-card-desc">{s.descripcion}</p>
                  </div>
                  <span className="hist-badge" style={{ color: cfg.color, background: cfg.bg }}>
                    {cfg.label}
                  </span>
                </div>

                {/* Observaciones del técnico */}
                {s.observaciones && (
                  <div className="hist-obs">
                    <QuoteIcon />
                    <p>"{s.observaciones}"</p>
                  </div>
                )}

                {/* Meta */}
                <div className="hist-card-meta">
                  <span><MapIcon />{s.colonia}, {s.delegacion}</span>
                  <span><CalIcon />{formatFecha(s.fecha_solicitud)}</span>
                  {s.tecnico_nombre && (
                    <span>
                      <UserIcon />
                      {s.tecnico_nombre} {s.tecnico_paterno}
                    </span>
                  )}
                </div>

                {/* Calificación */}
                {s.calificacion && (
                  <div className="hist-card-rating">
                    <span className="hist-rating-label">Tu calificación:</span>
                    <Estrellas calificacion={s.calificacion} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

    </ClienteLayout>
  )
}