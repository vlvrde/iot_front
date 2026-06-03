import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import bgImage from '../../assets/images/background.png'
import './Solicitudes.css'

/* ── Helpers ─────────────────────────────────────────────────── */
const ESTADO_CFG = {
  pendiente:  { label: 'Pendiente',   color: '#F59E0B', bg: '#FEF3C7' },
  asignado:   { label: 'Asignado',    color: '#6366f1', bg: '#EEF2FF' },
  en_proceso: { label: 'En proceso',  color: '#8B5CF6', bg: '#EDE9FE' },
  completado: { label: 'Completado',  color: '#10B981', bg: '#D1FAE5' },
  cancelado:  { label: 'Cancelado',   color: '#EF4444', bg: '#FEE2E2' },
}

const TIPO_LABEL = {
  instalacion:    'Instalación',
  reparacion:     'Reparación',
  falla:          'Falla',
  desinstalacion: 'Desinstalación',
}

const DISP_LABEL = {
  sensor_gas:       'Sensor Gas',
  sensor_agua:      'Sensor Agua',
  sistema_apertura: 'Apertura',
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

/* ── Íconos ── */
const Ico = {
  filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  close:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  user:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  map:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  cal:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  check:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  reset:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.47"/></svg>,
}

/* ══════════════════════════════════════════════════════════════
   MODAL — Asignar técnico
   ══════════════════════════════════════════════════════════════ */
function ModalAsignar({ solicitud, tecnicos, onClose, onSuccess, authHeaders }) {
  const [tecnicoId,     setTecnicoId]     = useState('')
  const [fechaEstimada, setFechaEstimada] = useState('')
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!tecnicoId) { setError('Selecciona un técnico.'); return }
    setLoading(true); setError('')
    try {
      const API = import.meta.env.VITE_API_URL
      const res = await fetch(`${API}/admin/solicitudes/${solicitud.id}/asignar`, {
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify({ tecnico_id: tecnicoId, fecha_estimada: fechaEstimada || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al asignar.')
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="as-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="as-modal">

        <div className="as-modal-header">
          <div>
            <h2>Asignar técnico</h2>
            <p className="as-modal-sub">
              {TIPO_LABEL[solicitud.tipo] || solicitud.tipo} ·{' '}
              {solicitud.colonia}, {solicitud.delegacion}
            </p>
          </div>
          <button className="as-modal-close" onClick={onClose}>{Ico.close}</button>
        </div>

        {/* Info solicitud */}
        <div className="as-sol-info">
          <span className="as-sol-badge"
            style={{ color: ESTADO_CFG[solicitud.estado]?.color, background: ESTADO_CFG[solicitud.estado]?.bg }}>
            {ESTADO_CFG[solicitud.estado]?.label}
          </span>
          <p className="as-sol-desc">{solicitud.descripcion}</p>
          <div className="as-sol-meta">
            <span>{Ico.user} {solicitud.cliente_nombre} {solicitud.cliente_paterno}</span>
            <span>{Ico.map} {solicitud.delegacion}</span>
            <span>{Ico.cal} {formatFecha(solicitud.fecha_solicitud)}</span>
          </div>
        </div>

        {error && <div className="as-modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="as-modal-form">

          <div className="as-field">
            <label>Técnico *</label>
            <select value={tecnicoId} onChange={e => { setTecnicoId(e.target.value); setError('') }} required>
              <option value="">Selecciona un técnico…</option>
              {tecnicos.filter(t => t.activo).map(t => (
                <option key={t.id} value={t.id}>
                  {t.nombre} {t.paterno} — {t.delegacion}
                  {t.solicitudes_activas > 0 ? ` (${t.solicitudes_activas} activas)` : ' (disponible)'}
                </option>
              ))}
            </select>
          </div>

          <div className="as-field">
            <label>Fecha estimada de visita</label>
            <input
              type="datetime-local"
              value={fechaEstimada}
              onChange={e => setFechaEstimada(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="as-modal-actions">
            <button type="button" className="as-btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="as-btn-submit" disabled={loading}>
              {loading ? <span className="as-spinner" /> : <>{Ico.check} Asignar técnico</>}
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
export default function AdminSolicitudes() {
  const { authHeaders } = useAuth()

  const [solicitudes, setSolicitudes] = useState([])
  const [tecnicos,    setTecnicos]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')

  // Filtros
  const [filtroEstado,    setFiltroEstado]    = useState('')
  const [filtroTipo,      setFiltroTipo]      = useState('')
  const [filtroDelegacion,setFiltroDelegacion]= useState('')

  // Modal
  const [modalSol, setModalSol] = useState(null)

  const cargarDatos = useCallback(() => {
    const API     = import.meta.env.VITE_API_URL
    const headers = authHeaders()
    setLoading(true)

    const params = new URLSearchParams()
    if (filtroEstado)     params.set('estado',     filtroEstado)
    if (filtroTipo)       params.set('tipo',        filtroTipo)
    if (filtroDelegacion) params.set('delegacion',  filtroDelegacion)

    Promise.all([
      fetch(`${API}/admin/solicitudes?${params}`, { headers }).then(r => r.json()),
      fetch(`${API}/admin/tecnicos`,              { headers }).then(r => r.json()),
    ])
      .then(([solData, tecData]) => {
        setSolicitudes(solData.solicitudes || [])
        setTecnicos(tecData.tecnicos       || [])
      })
      .catch(() => setError('No se pudieron cargar los datos.'))
      .finally(() => setLoading(false))
  }, [filtroEstado, filtroTipo, filtroDelegacion])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  const resetFiltros = () => {
    setFiltroEstado(''); setFiltroTipo(''); setFiltroDelegacion('')
  }

  const handleExito = () => { setModalSol(null); cargarDatos() }

  // Delegaciones únicas para el filtro
  const delegaciones = [...new Set(solicitudes.map(s => s.delegacion).filter(Boolean))].sort()

  return (
    <AdminLayout titulo="Solicitudes">

      {/* Hero */}
      <div className="as-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="as-hero-overlay" />
        <div className="as-hero-body">
          <span className="as-hero-eyebrow">Panel de administración · IoTech</span>
          <h1 className="as-hero-title">Gestión de Solicitudes</h1>
          <p className="as-hero-sub">
            {loading ? '…' : `${solicitudes.length} solicitud${solicitudes.length !== 1 ? 'es' : ''} encontrada${solicitudes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="as-filters">
        <div className="as-filters-left">
          <span className="as-filters-ico">{Ico.filter}</span>

          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.entries(ESTADO_CFG).map(([val, cfg]) => (
              <option key={val} value={val}>{cfg.label}</option>
            ))}
          </select>

          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            {Object.entries(TIPO_LABEL).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          <select value={filtroDelegacion} onChange={e => setFiltroDelegacion(e.target.value)}>
            <option value="">Todas las alcaldías</option>
            {delegaciones.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {(filtroEstado || filtroTipo || filtroDelegacion) && (
            <button className="as-filters-reset" onClick={resetFiltros}>
              {Ico.reset} Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Estados */}
      {loading && <div className="as-loading">Cargando solicitudes…</div>}
      {error   && <div className="as-error">{error}</div>}

      {/* Tabla */}
      {!loading && !error && (
        solicitudes.length === 0 ? (
          <div className="as-empty">
            <p>No hay solicitudes con los filtros aplicados.</p>
            {(filtroEstado || filtroTipo || filtroDelegacion) && (
              <button className="as-filters-reset" onClick={resetFiltros}>{Ico.reset} Limpiar filtros</button>
            )}
          </div>
        ) : (
          <div className="as-table-wrap">
            <table className="as-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Cliente</th>
                  <th>Dispositivo</th>
                  <th>Ubicación</th>
                  <th>Fecha</th>
                  <th>Técnico</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map(s => {
                  const cfg      = ESTADO_CFG[s.estado] || { label: s.estado, color: '#6B7280', bg: '#F3F4F6' }
                  const asignable = ['pendiente', 'asignado'].includes(s.estado)
                  return (
                    <tr key={s.id}>
                      <td>
                        <span className="as-tipo">{TIPO_LABEL[s.tipo] || s.tipo}</span>
                        <span className="as-desc">{s.descripcion}</span>
                      </td>
                      <td>
                        <span className="as-badge" style={{ color: cfg.color, background: cfg.bg }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="as-cliente">
                        <div className="as-avatar">{s.cliente_nombre?.charAt(0)}</div>
                        <span>{s.cliente_nombre} {s.cliente_paterno}</span>
                      </td>
                      <td>
                        <span className="as-disp">{DISP_LABEL[s.dispositivo_tipo] || s.dispositivo_tipo}</span>
                        <span className="as-disp-sub">{s.dispositivo_marca} {s.dispositivo_modelo}</span>
                      </td>
                      <td>
                        <span className="as-loc">{Ico.map} {s.colonia}</span>
                        <span className="as-loc-sub">{s.delegacion}</span>
                      </td>
                      <td>
                        <span className="as-fecha">{formatFecha(s.fecha_solicitud)}</span>
                        {s.fecha_estimada && (
                          <span className="as-fecha-est">Visita: {formatFecha(s.fecha_estimada)}</span>
                        )}
                      </td>
                      <td>
                        {s.tecnico_nombre
                          ? <span className="as-tecnico">{s.tecnico_nombre} {s.tecnico_paterno}</span>
                          : <span className="as-sin-tecnico">Sin asignar</span>
                        }
                      </td>
                      <td>
                        {asignable && (
                          <button className="as-btn-asignar" onClick={() => setModalSol(s)}>
                            {s.estado === 'asignado' ? 'Reasignar' : 'Asignar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Modal */}
      {modalSol && (
        <ModalAsignar
          solicitud={modalSol}
          tecnicos={tecnicos}
          onClose={() => setModalSol(null)}
          onSuccess={handleExito}
          authHeaders={authHeaders}
        />
      )}

    </AdminLayout>
  )
}