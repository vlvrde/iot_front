import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import TecnicoLayout from '../../components/tecnico/TecnicoLayout'
import './Citas.css'

const ESTADO_CONFIG = {
  asignado:   { label: 'Asignado',   color: '#3B82F6', bg: '#DBEAFE' },
  en_proceso: { label: 'En proceso', color: '#8B5CF6', bg: '#EDE9FE' },
}

const TIPO_LABEL = {
  instalacion:    'Instalación',
  reparacion:     'Reparación',
  falla:          'Falla',
  desinstalacion: 'Desinstalación',
}

const DISP_LABEL = {
  sensor_gas:       'Sensor de Gas',
  sensor_agua:      'Sensor de Agua',
  sistema_apertura: 'Sistema de Apertura',
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
  })
}
function formatHora(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

const CalIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const MapIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const DevIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const ArrowIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
const EmptyIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>

export default function Citas() {
  const { authHeaders } = useAuth()
  const navigate = useNavigate()
  const [citas,   setCitas]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const cargarCitas = useCallback(() => {
    const API = import.meta.env.VITE_API_URL
    setLoading(true)
    fetch(`${API}/tecnico/citas`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setCitas(data.citas || []))
      .catch(() => setError('No se pudieron cargar las citas.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargarCitas() }, [cargarCitas])

  const pendientes  = citas.filter(c => c.estado === 'asignado').length
  const en_proceso  = citas.filter(c => c.estado === 'en_proceso').length

  return (
    <TecnicoLayout>
      <div className="citas-page">

        {/* Hero */}
        <div className="citas-hero">
          <div className="citas-hero-text">
            <span className="citas-eyebrow">Panel Técnico · IoTech</span>
            <h1>Mis Citas</h1>
            <p>Servicios asignados y en proceso.</p>
          </div>
          <div className="citas-hero-counters">
            <div className="citas-counter">
              <strong>{loading ? '—' : pendientes}</strong>
              <span>Pendientes</span>
            </div>
          </div>
        </div>

        {loading && <div className="citas-loading">Cargando citas…</div>}
        {error   && <div className="citas-error">{error}</div>}

        {!loading && !error && citas.length === 0 && (
          <div className="citas-empty">
            <div className="citas-empty-icon"><EmptyIcon /></div>
            <h3>Sin citas asignadas</h3>
            <p>Cuando el administrador te asigne servicios, aparecerán aquí.</p>
          </div>
        )}

        {!loading && !error && citas.length > 0 && (
          <div className="citas-list">
            {citas.map(cita => {
              const cfg = ESTADO_CONFIG[cita.estado] || { label: cita.estado, color: '#6B7280', bg: '#F3F4F6' }
              return (
                <div className="cita-card" key={cita.id}>
                  {/* Franja de color por estado */}
                  <div className="cita-card-stripe" style={{ background: cfg.color }} />

                  <div className="cita-card-body">
                    <div className="cita-card-top">
                      <span className="cita-tipo">{TIPO_LABEL[cita.tipo] || cita.tipo}</span>
                      <span className="cita-badge" style={{ color: cfg.color, background: cfg.bg }}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="cita-meta">
                      <span><UserIcon />{cita.cliente_nombre} {cita.cliente_paterno}</span>
                      <span><DevIcon />{DISP_LABEL[cita.dispositivo_tipo] || cita.dispositivo_tipo}</span>
                      <span><MapIcon />{cita.colonia}, {cita.delegacion}</span>
                      {cita.fecha_estimada && (
                        <span><CalIcon />{formatFecha(cita.fecha_estimada)} · {formatHora(cita.fecha_estimada)}</span>
                      )}
                    </div>
                  </div>

                  <button className="cita-btn-detalle" onClick={() => navigate(`/tecnico/citas/${cita.id}`)}>
                    Ver detalle <ArrowIcon />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </TecnicoLayout>
  )
}