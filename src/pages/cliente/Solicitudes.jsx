import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import ClienteLayout from '../../components/cliente/ClienteLayout'
import bgImage from '../../assets/images/background.png'
import './Solicitudes.css'
import { ESTADO_CDMX, SelectAlcaldia } from '../../constants/cdmx'


/* ── Helpers ── */
const ESTADO_CONFIG = {
  pendiente:   { label: 'Pendiente',  color: '#F59E0B', bg: '#FEF3C7' },
  asignado:    { label: 'Asignado',   color: '#3B82F6', bg: '#DBEAFE' },
  en_proceso:  { label: 'En proceso', color: '#8B5CF6', bg: '#EDE9FE' },
  completado:  { label: 'Completado', color: '#10B981', bg: '#D1FAE5' },
  cancelado:   { label: 'Cancelado',  color: '#EF4444', bg: '#FEE2E2' },
}

const TIPO_LABEL = {
  instalacion:    'Instalación',
  reparacion:     'Reparación',
  falla:          'Falla',
  desinstalacion: 'Desinstalación',
}

const TIPO_OPTIONS = [
  { value: 'reparacion',     label: 'Reparación' },
  { value: 'falla',          label: 'Falla' },
  { value: 'desinstalacion', label: 'Desinstalación' },
]

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

/* ── Íconos ── */
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const MapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const EmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

/* ══════════════════════════════════════════════════════════════
   MODAL — Nueva Solicitud
   ══════════════════════════════════════════════════════════════ */
function ModalNuevaSolicitud({ dispositivos, onClose, onSuccess, authHeaders }) {
  const [form, setForm] = useState({
    dispositivo_id: '',
    tipo:           'instalacion',
    descripcion:    '',
    calle:          '',
    num_exterior:   '',
    num_interior:   '',
    codigo_postal:  '',
    colonia:        '',
    delegacion:     '',
    estado_dir:  ESTADO_CDMX,
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const { dispositivo_id, tipo, descripcion, calle, num_exterior, codigo_postal, colonia, delegacion } = form

    if (!dispositivo_id || !tipo || !descripcion.trim() || !calle || !num_exterior || !codigo_postal || !colonia || !delegacion) {
      setError('Completa todos los campos obligatorios (*).')
      return
    }

    setLoading(true)
    try {
      const API = import.meta.env.VITE_API_URL
      const res = await fetch(`${API}/solicitudes`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al crear la solicitud.')
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (

    
    <div className="sol-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sol-modal">

        <div className="sol-modal-header">
          <h2>Nueva solicitud de servicio</h2>
          <button className="sol-modal-close" onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>

        {error && <div className="sol-modal-error">{error}</div>}

        <form className="sol-modal-form" onSubmit={handleSubmit}>

          <div className="sol-modal-section">Detalle del servicio</div>

          <div className="sol-modal-fields">
            <div className="sol-field sol-field--full">
              <label>Dispositivo *</label>
              <select name="dispositivo_id" value={form.dispositivo_id} onChange={handleChange} required>
                <option value="">Selecciona un dispositivo…</option>
                {dispositivos.map(d => (
                  <option key={d.dispositivo_id} value={d.dispositivo_id}>
                    {d.marca} {d.modelo} — Serie: {d.numero_serie}
                  </option>
                ))}
              </select>
            </div>

            <div className="sol-field">
              <label>Tipo de servicio *</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} required>
                {TIPO_OPTIONS.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="sol-field sol-field--full">
              <label>Descripción del problema *</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe brevemente el problema o motivo del servicio…"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="sol-modal-section">Dirección de atención</div>

          <div className="sol-modal-fields">
            <div className="sol-field sol-field--full">
              <label>Calle *</label>
              <input name="calle" value={form.calle} onChange={handleChange} placeholder="Av. Insurgentes Sur" />
            </div>
            <div className="sol-field">
              <label>Núm. exterior *</label>
              <input name="num_exterior" value={form.num_exterior} onChange={handleChange} placeholder="100" />
            </div>
            <div className="sol-field">
              <label>Núm. interior</label>
              <input name="num_interior" value={form.num_interior} onChange={handleChange} placeholder="Depto 3B" />
            </div>
            <div className="sol-field">
              <label>Código postal *</label>
              <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} placeholder="07320" maxLength={5} />
            </div>
            <div className="sol-field">
              <label>Colonia *</label>
              <input name="colonia" value={form.colonia} onChange={handleChange} placeholder="Industrial Vallejo" />
            </div>
            <div className="sol-field sol-field--full">
              <label>Alcaldía *</label>
              <SelectAlcaldia
                name="delegacion"
                value={form.delegacion}
                onChange={handleChange}
                className="sol-select"
              />
            </div>
          </div>

          <div className="sol-modal-actions">
            <button type="button" className="sol-modal-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="sol-modal-submit" disabled={loading}>
              {loading ? <span className="sol-spinner" /> : 'Crear solicitud'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
   ══════════════════════════════════════════════════════════════ */
export default function Solicitudes() {
  const { authHeaders } = useAuth()

  const [solicitudes,  setSolicitudes]  = useState([])
  const [dispositivos, setDispositivos] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [modalOpen,    setModalOpen]    = useState(false)

  const cargarDatos = useCallback(() => {
    const API     = import.meta.env.VITE_API_URL
    const headers = authHeaders()
    setLoading(true)

    Promise.all([
      fetch(`${API}/solicitudes/mis-solicitudes`, { headers }).then(r => r.json()),
      fetch(`${API}/dispositivos/mis-dispositivos`, { headers }).then(r => r.json()),
    ])
      .then(([solData, dispData]) => {
        setSolicitudes(solData.solicitudes  || [])
        setDispositivos(dispData.dispositivos || [])
      })
      .catch(() => setError('No se pudieron cargar las solicitudes.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  const handleExito = () => {
    setModalOpen(false)
    cargarDatos()
  }

  return (
    <ClienteLayout titulo="Mis Solicitudes">



      {/* Encabezado */}
      <div className="sol-header">
        <p className="sol-count">
          {loading ? '…' : `${solicitudes.length} solicitud${solicitudes.length !== 1 ? 'es' : ''} activa${solicitudes.length !== 1 ? 's' : ''}`}
        </p>
        <button
          className="sol-btn-new"
          onClick={() => setModalOpen(true)}
          disabled={dispositivos.length === 0}
          title={dispositivos.length === 0 ? 'Primero registra un dispositivo' : ''}
        >
          <PlusIcon />
          Nueva solicitud
        </button>
      </div>

      {dispositivos.length === 0 && !loading && (
        <div className="sol-notice">
          No tienes dispositivos registrados. Ve a <strong>Mis Dispositivos</strong> para registrar uno antes de crear una solicitud.
        </div>
      )}

      {/* Estados */}
      {loading && <div className="sol-loading">Cargando solicitudes…</div>}
      {error   && <div className="sol-error">{error}</div>}

      {/* Lista vacía */}
      {!loading && !error && solicitudes.length === 0 && (
        <div className="sol-empty">
          <div className="sol-empty-icon"><EmptyIcon /></div>
          <h3>Sin solicitudes activas</h3>
          <p>Crea una nueva solicitud de instalación, mantenimiento o reparación.</p>
          {dispositivos.length > 0 && (
            <button className="sol-btn-new" onClick={() => setModalOpen(true)}>
              <PlusIcon /> Nueva solicitud
            </button>
          )}
        </div>
      )}

      {/* Lista */}
      {!loading && !error && solicitudes.length > 0 && (
        <div className="sol-list">
          {solicitudes.map(s => {
            const cfg = ESTADO_CONFIG[s.estado] || { label: s.estado, color: '#6B7280', bg: '#F3F4F6' }
            return (
              <div className="sol-card" key={s.id}>
                <div className="sol-card-top">
                  <div className="sol-card-left">
                    <span className="sol-card-tipo">{TIPO_LABEL[s.tipo] || s.tipo}</span>
                    <p className="sol-card-desc">{s.descripcion}</p>
                  </div>
                  <span className="sol-badge" style={{ color: cfg.color, background: cfg.bg }}>
                    {cfg.label}
                  </span>
                </div>

                <div className="sol-card-meta">
                  <span>
                    <MapIcon />
                    {s.colonia}, {s.delegacion}
                  </span>
                  <span>
                    <CalIcon />
                    {formatFecha(s.fecha_solicitud)}
                  </span>
                  {s.fecha_estimada && (
                    <span>
                      <CalIcon />
                      Visita: {formatFecha(s.fecha_estimada)}
                    </span>
                  )}
                </div>

                {s.tecnico_nombre && (
                  <div className="sol-card-tecnico">
                    <UserIcon />
                    <span>Técnico asignado: <strong>{s.tecnico_nombre} {s.tecnico_paterno}</strong></span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ModalNuevaSolicitud
          dispositivos={dispositivos}
          onClose={() => setModalOpen(false)}
          onSuccess={handleExito}
          authHeaders={authHeaders}
        />
      )}

    </ClienteLayout>
  )
}