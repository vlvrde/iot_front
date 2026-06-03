import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ClienteLayout from '../../components/cliente/ClienteLayout'
import './MisDispositivos.css'

import fireImg  from '../../assets/images/fire.png'
import waterImg from '../../assets/images/water.png'
import iotImg   from '../../assets/images/system.png'

const DISPOSITIVO_IMG = {
  sensor_gas:       fireImg,
  sensor_agua:      waterImg,
  sistema_apertura: iotImg,
}

const DISPOSITIVO_LABEL = {
  sensor_gas:       'Sensor de Gas',
  sensor_agua:      'Sensor de Agua',
  sistema_apertura: 'Sistema de Apertura de Zaguán',
}

const DISPOSITIVO_COLOR = {
  sensor_gas:       { color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  sensor_agua:      { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  sistema_apertura: { color: '#1A1A2E', bg: 'rgba(26,26,46,0.08)' },
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)

const SerieIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
  </svg>
)

export default function MisDispositivos() {
  const { authHeaders } = useAuth()
  const navigate = useNavigate()

  const [dispositivos, setDispositivos] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL
    fetch(`${API}/dispositivos/mis-dispositivos`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setDispositivos(data.dispositivos || []))
      .catch(() => setError('No se pudieron cargar los dispositivos.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ClienteLayout titulo="Mis Dispositivos">

      {/* Encabezado */}
      <div className="disp-header">
        <p className="disp-count">
          {loading ? '…' : `${dispositivos.length} dispositivo${dispositivos.length !== 1 ? 's' : ''} registrado${dispositivos.length !== 1 ? 's' : ''}`}
        </p>
        <button className="disp-btn-add" onClick={() => navigate('/carrito')}>
          <CartIcon />
          Adquirir dispositivo
        </button>
      </div>

      {/* Estados */}
      {loading && <div className="disp-loading">Cargando dispositivos…</div>}
      {error   && <div className="disp-error">{error}</div>}

      {/* Vacío */}
      {!loading && !error && dispositivos.length === 0 && (
        <div className="disp-empty">
          <div className="disp-empty-img">
            <img src={fireImg} alt="Sin dispositivos" />
          </div>
          <h3>Aún no tienes dispositivos</h3>
          <p>Adquiere tu primer dispositivo IoT desde el catálogo y lo verás aquí automáticamente.</p>
          <button className="disp-btn-add" onClick={() => navigate('/carrito')}>
            <CartIcon />
            Ir al catálogo
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && dispositivos.length > 0 && (
        <div className="disp-grid">
          {dispositivos.map(d => {
            const colors = DISPOSITIVO_COLOR[d.tipo] || { color: '#667eea', bg: 'rgba(102,126,234,0.08)' }
            return (
              <div className="disp-card" key={d.dispositivo_id}>
                <div className="disp-card-img" style={{ background: colors.bg }}>
                  <img src={DISPOSITIVO_IMG[d.tipo]} alt={DISPOSITIVO_LABEL[d.tipo]} />
                </div>
                <div className="disp-card-body">
                  <span className="disp-card-tipo" style={{ color: colors.color, background: colors.bg }}>
                    {DISPOSITIVO_LABEL[d.tipo] || d.tipo}
                  </span>
                  <h3 className="disp-card-nombre">{d.marca} {d.modelo}</h3>
                  <div className="disp-card-meta">
                    <div className="disp-card-meta-row">
                      <SerieIcon />
                      <span className="disp-card-serie">{d.numero_serie}</span>
                    </div>
                    <div className="disp-card-meta-row">
                      <span className="disp-card-fecha">Registrado el {formatFecha(d.fecha_registro)}</span>
                    </div>
                  </div>
                  <div className="disp-card-precio">
                    ${Number(d.precio).toLocaleString('es-MX')} MXN
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </ClienteLayout>
  )
}