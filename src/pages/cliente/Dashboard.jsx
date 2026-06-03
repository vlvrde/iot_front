import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ClienteLayout from '../../components/cliente/ClienteLayout'
import bgImage from '../../assets/images/background.png'
import './Dashboard.css'
import fireImg  from '../../assets/images/fire.png'
import waterImg from '../../assets/images/water.png'
import iotImg   from '../../assets/images/system.png'

const DISPOSITIVO_IMG = {
  sensor_gas:       fireImg,
  sensor_agua:      waterImg,
  sistema_apertura: iotImg,
}

// ── Iconos ────────────────────────────────────────────────────
const Icons = {
  solicitudes: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  dispositivos: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  historial: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  qr: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <path d="M14 14h2v2h-2zM18 14h3M14 18h1M17 18h3M20 21v-3"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  arrowRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  clock: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  shop: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  gas: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
    </svg>
  ),
  agua: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  ),
  zaguan: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18M3 9h6M3 15h6"/>
    </svg>
  ),
}

// ── Config ────────────────────────────────────────────────────
const TIPO_LABEL = {
  instalacion: 'Instalación', reparacion: 'Reparación',
  falla: 'Falla', desinstalacion: 'Desinstalación',
}
const ESTADO_COLOR = {
  pendiente: '#F59E0B', asignado: '#6366f1',
  en_proceso: '#8B5CF6', completado: '#10B981', cancelado: '#EF4444',
}
const DISP_CFG = {
  sensor_gas:       { icon: Icons.gas,    label: 'Sensor de Gas',      color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  sensor_agua:      { icon: Icons.agua,   label: 'Sensor de Agua',     color: '#6366f1', bg: 'rgba(99,102,241,0.10)' },
  sistema_apertura: { icon: Icons.zaguan, label: 'Sistema de Apertura',color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
}

const ACCESOS = [
  { id: 'solicitudes',  label: 'Mis Solicitudes',  icon: Icons.solicitudes,  ruta: '/cliente/solicitudes',  desc: 'Crea y consulta tus servicios', img: '/src/assets/images/solicitudes.png' },
  { id: 'dispositivos', label: 'Mis Dispositivos', icon: Icons.dispositivos, ruta: '/cliente/dispositivos', desc: 'Administra tu equipo IoT', img: '/src/assets/images/background.png' },
  { id: 'historial',    label: 'Historial',         icon: Icons.historial,    ruta: '/cliente/historial',    desc: 'Servicios completados', img: '/src/assets/images/historial.png' },
  { id: 'validar-qr',  label: 'Validar QR',        icon: Icons.qr,           ruta: '/cliente/validar-qr',  desc: 'Verifica a tu técnico', img: '/src/assets/images/qr.png' },
]

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Componente principal ──────────────────────────────────────
export default function ClienteDashboard() {
  const { user, authHeaders } = useAuth()
  const navigate = useNavigate()

  const [resumen, setResumen] = useState({
    solicitudesActivas: null, totalDispositivos: null, ultimaActividad: null,
  })
  const [dispositivos, setDispositivos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL
    const headers = authHeaders()
    Promise.all([
      fetch(`${API}/solicitudes/mis-solicitudes`, { headers }).then(r => r.json()),
      fetch(`${API}/dispositivos/mis-dispositivos`, { headers }).then(r => r.json()),
      fetch(`${API}/solicitudes/historial`, { headers }).then(r => r.json()),
    ])
      .then(([solData, dispData, histData]) => {
        const activas   = solData.solicitudes   || []
        const disps     = dispData.dispositivos || []
        const historial = histData.solicitudes  || []
        const todas = [...activas, ...historial].sort(
          (a, b) => new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud)
        )
        setResumen({
          solicitudesActivas: activas.length,
          totalDispositivos:  disps.length,
          ultimaActividad:    todas[0] || null,
        })
        setDispositivos(disps)
      })
      .catch(() => setResumen({ solicitudesActivas: 0, totalDispositivos: 0, ultimaActividad: null }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ClienteLayout titulo="Inicio">

      {/* ══ 1. HERO ══════════════════════════════════════════ */}
      <div className="db-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="db-hero-overlay" />
        <div className="db-hero-body">
          <div className="db-hero-text">
            <span className="db-hero-eyebrow">Panel de control · IoTech</span>
            <h1 className="db-hero-title">
              Hola, <em>{user?.nombre} {user?.paterno}</em>
            </h1>
            <p className="db-hero-sub">Gestiona tus dispositivos y servicios desde aquí.</p>
          </div>
        </div>
      </div>

      {/* ══ 2. MÉTRICAS ══════════════════════════════════════ */}
      <div className="db-metrics">

        <div className="db-metric">
          <span className="db-metric-label">Solicitudes activas</span>
          <strong className="db-metric-val" style={{ color: '#6366f1' }}>
            {loading ? '—' : resumen.solicitudesActivas}
          </strong>
        </div>

        <div className="db-metric-sep" />

        <div className="db-metric">
          <span className="db-metric-label">Dispositivos registrados</span>
          <strong className="db-metric-val" style={{ color: '#10B981' }}>
            {loading ? '—' : resumen.totalDispositivos}
          </strong>
        </div>

        <div className="db-metric-sep" />

        <div className="db-metric">
          <span className="db-metric-label">Última actividad</span>
          {loading ? (
            <strong className="db-metric-val">—</strong>
          ) : resumen.ultimaActividad ? (
            <div className="db-metric-act">
              <strong className="db-metric-val db-metric-val--sm">
                {TIPO_LABEL[resumen.ultimaActividad.tipo] || resumen.ultimaActividad.tipo}
              </strong>
              <span className="db-metric-pill"
                style={{
                  color: ESTADO_COLOR[resumen.ultimaActividad.estado],
                  background: `${ESTADO_COLOR[resumen.ultimaActividad.estado]}18`,
                }}>
                {Icons.clock}
                {resumen.ultimaActividad.estado} · {formatFecha(resumen.ultimaActividad.fecha_solicitud)}
              </span>
            </div>
          ) : (
            <strong className="db-metric-val db-metric-val--sm">Sin actividad</strong>
          )}
        </div>

      </div>

      {/* ══ 3. MIS DISPOSITIVOS ══════════════════════════════ */}
      <div className="db-block">
        <div className="db-block-header">
          <h2 className="db-block-title">Mis dispositivos</h2>
          <button className="db-block-link" onClick={() => navigate('/cliente/dispositivos')}>
            Ver todos {Icons.arrowRight}
          </button>
        </div>

        {!loading && dispositivos.length > 0 && (
          <div className="db-devs">
            {dispositivos.map(d => {
              const cfg = DISP_CFG[d.tipo] || DISP_CFG['sensor_gas']
              return (
                <div key={d.dispositivo_id} className="db-dev-card">
                  <div className="db-dev-thumb" style={{ background: cfg.bg }}>
                    <img src={DISPOSITIVO_IMG[d.tipo]} alt={cfg.label} />
                  </div>
                  <span className="db-dev-name">{cfg.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ══ 4. BANNER PROMO ══════════════════════════════════ */}
      <div className="db-promo" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="db-promo-overlay" />
        <div className="db-promo-content">
          <div className="db-promo-icon">{Icons.shop}</div>
          <div>
            <h3 className="db-promo-title">¿Quieres ampliar tu hogar inteligente?</h3>
            <p className="db-promo-sub">Explora nuestro catálogo de dispositivos IoT y solicita la instalación.</p>
          </div>
        </div>
        <button className="db-promo-btn" onClick={() => navigate('/catalogo/sensor-gas')}>
          Ver catálogo {Icons.arrow}
        </button>
      </div>

      {/* ══ 5. ACCESOS CON IMAGEN ════════════════════════════ */}
      <div className="db-block">
        <div className="db-block-header">
          <h2 className="db-block-title">Accesos rápidos</h2>
        </div>
        <div className="db-links">
          {ACCESOS.map(a => (
            <button
              key={a.id}
              className="db-link-card"
              onClick={() => navigate(a.ruta)}
              style={{ backgroundImage: `url(${a.img})` }}
            >
              <div className="db-link-overlay" />
              <div className="db-link-content">
                <div className="db-link-icon">{a.icon}</div>
                <span className="db-link-label">{a.label}</span>
                <span className="db-link-desc">{a.desc}</span>
              </div>
              <div className="db-link-arrow">{Icons.arrow}</div>
            </button>
          ))}
        </div>
      </div>

    </ClienteLayout>
  )
}