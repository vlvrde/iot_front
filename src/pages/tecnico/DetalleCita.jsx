import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import TecnicoLayout from '../../components/tecnico/TecnicoLayout'
import QRCode from 'qrcode'
import './DetalleCita.css'

/* ── Helpers ── */
const TIPO_LABEL = {
  instalacion:    'Instalación',
  reparacion:     'Reparación',
  falla:          'Falla',
  desinstalacion: 'Desinstalación',
}

const DISP_LABEL = {
  sensor_gas:       'Sensor de Gas',
  sensor_agua:      'Sensor de Agua',
  sistema_apertura: 'Sistema de Apertura de Zaguán',
}

const ESTADO_CONFIG = {
  asignado:   { label: 'Asignado',   color: '#3B82F6', bg: '#DBEAFE' },
  en_proceso: { label: 'En proceso', color: '#8B5CF6', bg: '#EDE9FE' },
  completado: { label: 'Completado', color: '#10B981', bg: '#D1FAE5' },
  cancelado:  { label: 'Cancelado',  color: '#EF4444', bg: '#FEE2E2' },
}

function formatFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  })
}

function formatHora(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

/* ── Íconos ── */
const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
)
const QrIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <path d="M14 14h2v2h-2zM18 14h3M14 18h1M17 18h3M20 21v-3"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.47"/>
  </svg>
)

/* ── Modal QR ── */
function ModalQR({ token, expiracion, onClose, onRefresh, loadingQR }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (token && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, token, {
        width: 220,
        margin: 2,
        color: { dark: '#0F4C75', light: '#ffffff' }
      })
    }
  }, [token])

  const minutosRestantes = expiracion
    ? Math.max(0, Math.floor((new Date(expiracion) - Date.now()) / 60000))
    : 0

  return (
    <div className="dc-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="dc-qr-modal">
        <div className="dc-qr-header">
          <h3>Código QR de identidad</h3>
          <button className="dc-qr-close" onClick={onClose}><CloseIcon /></button>
        </div>

        <div className="dc-qr-body">
          <p className="dc-qr-hint">Muestra este código al cliente para verificar tu identidad.</p>

          <div className="dc-qr-canvas-wrap">
            <canvas ref={canvasRef} />
          </div>

          <div className={`dc-qr-timer ${minutosRestantes <= 5 ? 'dc-qr-timer--urgent' : ''}`}>
            ⏱ Expira en {minutosRestantes} min
          </div>

          <button className="dc-qr-refresh" onClick={onRefresh} disabled={loadingQR}>
            {loadingQR ? <span className="dc-spinner-sm" /> : <RefreshIcon />}
            Generar nuevo QR
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Modal Resultado ── */
function ModalResultado({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    resultado:           'resuelto',
    descripcion_trabajo: '',
    materiales:          '',
    observaciones:       '',
  })

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.descripcion_trabajo.trim()) return
    onSubmit(form)
  }

  return (
    <div className="dc-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="dc-resultado-modal">
        <div className="dc-qr-header">
          <h3>Registrar resultado del servicio</h3>
          <button className="dc-qr-close" onClick={onClose}><CloseIcon /></button>
        </div>

        <form className="dc-resultado-form" onSubmit={handleSubmit}>
          <div className="dc-field">
            <label>Resultado *</label>
            <select name="resultado" value={form.resultado} onChange={handleChange}>
              <option value="resuelto">Resuelto</option>
              <option value="requiere_seguimiento">Requiere seguimiento</option>
              <option value="no_resuelto">No resuelto</option>
            </select>
          </div>

          <div className="dc-field">
            <label>Descripción del trabajo realizado *</label>
            <textarea
              name="descripcion_trabajo"
              value={form.descripcion_trabajo}
              onChange={handleChange}
              placeholder="Describe el trabajo realizado…"
              rows={3}
              required
            />
          </div>

          <div className="dc-field">
            <label>Materiales utilizados</label>
            <input
              name="materiales"
              value={form.materiales}
              onChange={handleChange}
              placeholder="Ej. Cable, sensor, tornillos…"
            />
          </div>

          <div className="dc-field">
            <label>Observaciones adicionales</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              placeholder="Notas técnicas sobre el dispositivo…"
              rows={2}
            />
          </div>

          <div className="dc-resultado-actions">
            <button type="button" className="dc-btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="dc-btn-submit" disabled={loading}>
              {loading ? <span className="dc-spinner-sm" /> : <><CheckIcon /> Confirmar</>}
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
export default function DetalleCita() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { authHeaders } = useAuth()

  const [cita,         setCita]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [qrToken,      setQrToken]      = useState(null)
  const [qrExpiracion, setQrExpiracion] = useState(null)
  const [loadingQR,    setLoadingQR]    = useState(false)
  const [modalQR,      setModalQR]      = useState(false)
  const [modalRes,     setModalRes]     = useState(false)
  const [loadingRes,   setLoadingRes]   = useState(false)
  const [msgEstado,    setMsgEstado]    = useState('')
  const [loadingEst,   setLoadingEst]   = useState(false)

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL
    fetch(`${API}/tecnico/citas/${id}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (!data.cita) throw new Error('No encontrada')
        setCita(data.cita)
      })
      .catch(() => setError('No se pudo cargar el detalle de la cita.'))
      .finally(() => setLoading(false))
  }, [id])

  /* Generar QR */
  const generarQR = async () => {
    setLoadingQR(true)
    try {
      const API = import.meta.env.VITE_API_URL
      const res = await fetch(`${API}/qr/generar`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ solicitud_id: id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setQrToken(data.token)
      setQrExpiracion(data.expiracion)
      setModalQR(true)
    } catch (err) {
      setMsgEstado(`Error: ${err.message}`)
    } finally {
      setLoadingQR(false)
    }
  }

  /* Actualizar estado */
  const actualizarEstado = async (nuevoEstado) => {
    setLoadingEst(true)
    setMsgEstado('')
    try {
      const API = import.meta.env.VITE_API_URL
      const res = await fetch(`${API}/tecnico/citas/${id}/estado`, {
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify({ estado: nuevoEstado }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setCita(prev => ({ ...prev, estado: nuevoEstado }))
      setMsgEstado(data.message)
    } catch (err) {
      setMsgEstado(`Error: ${err.message}`)
    } finally {
      setLoadingEst(false)
    }
  }

  /* Registrar resultado */
  const registrarResultado = async (form) => {
    setLoadingRes(true)
    try {
      const API = import.meta.env.VITE_API_URL
      const res = await fetch(`${API}/tecnico/citas/${id}/resultado`, {
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setModalRes(false)
      setCita(prev => ({ ...prev, estado: 'completado' }))
      setMsgEstado('Servicio completado exitosamente.')
    } catch (err) {
      setMsgEstado(`Error: ${err.message}`)
    } finally {
      setLoadingRes(false)
    }
  }

  if (loading) return (
    <TecnicoLayout>
      <div className="dc-loading">Cargando detalle…</div>
    </TecnicoLayout>
  )

  if (error || !cita) return (
    <TecnicoLayout>
      <div className="dc-error-page">
        <p>{error || 'Cita no encontrada.'}</p>
        <button onClick={() => navigate('/tecnico/citas')}>← Regresar</button>
      </div>
    </TecnicoLayout>
  )

  const cfg = ESTADO_CONFIG[cita.estado] || { label: cita.estado, color: '#6B7280', bg: '#F3F4F6' }

  return (
    <TecnicoLayout>
      <div className="dc-page">

        {/* ── Topbar ── */}
        <div className="dc-topbar">
          <button className="dc-back" onClick={() => navigate('/tecnico/citas')}>
            <BackIcon /> Mis citas
          </button>
          <span className="dc-badge" style={{ color: cfg.color, background: cfg.bg }}>
            {cfg.label}
          </span>
        </div>

        {/* ── Header ── */}
        <div className="dc-header">
          <h1>{TIPO_LABEL[cita.tipo] || cita.tipo}</h1>
          <p className="dc-header-sub">
            {formatFecha(cita.fecha_estimada)}
            {cita.fecha_estimada && ` · ${formatHora(cita.fecha_estimada)}`}
          </p>
        </div>

        {/* ── Mensaje de estado ── */}
        {msgEstado && (
          <div className={`dc-msg ${msgEstado.startsWith('Error') ? 'dc-msg--error' : 'dc-msg--ok'}`}>
            {msgEstado}
          </div>
        )}

        {/* ── Grid de info ── */}
        <div className="dc-grid">

          {/* Cliente */}
          <div className="dc-card">
            <h3 className="dc-card-title">Cliente</h3>
            <div className="dc-info-row"><span>Nombre</span><strong>{cita.cliente_nombre} {cita.cliente_paterno}</strong></div>
            {cita.cliente_telefono && (
              <div className="dc-info-row">
                <span>Teléfono</span>
                <a href={`tel:${cita.cliente_telefono}`} className="dc-link">{cita.cliente_telefono}</a>
              </div>
            )}
          </div>

          {/* Dispositivo */}
          <div className="dc-card">
            <h3 className="dc-card-title">Dispositivo</h3>
            <div className="dc-info-row"><span>Tipo</span><strong>{DISP_LABEL[cita.dispositivo_tipo] || cita.dispositivo_tipo}</strong></div>
            <div className="dc-info-row"><span>Modelo</span><strong>{cita.dispositivo_marca} {cita.dispositivo_modelo}</strong></div>
            {cita.numero_serie && (
              <div className="dc-info-row"><span>Serie</span><code className="dc-code">{cita.numero_serie}</code></div>
            )}
          </div>

          {/* Dirección */}
          <div className="dc-card dc-card--full">
            <h3 className="dc-card-title">Dirección de atención</h3>
            <div className="dc-info-row">
              <span>Dirección</span>
              <strong>
                {cita.calle} {cita.num_exterior}
                {cita.num_interior ? ` Int. ${cita.num_interior}` : ''}
              </strong>
            </div>
            <div className="dc-info-row"><span>Colonia</span><strong>{cita.colonia}, CP {cita.codigo_postal}</strong></div>
            <div className="dc-info-row"><span>Alcaldía</span><strong>{cita.delegacion}, {cita.estado_dir}</strong></div>
          </div>

          {/* Descripción */}
          <div className="dc-card dc-card--full">
            <h3 className="dc-card-title">Descripción del problema</h3>
            <p className="dc-desc">{cita.descripcion}</p>
          </div>

        </div>

        {/* ── Acciones ── */}
        {cita.estado !== 'completado' && cita.estado !== 'cancelado' && (
          <div className="dc-actions">
            <h3 className="dc-actions-title">Acciones</h3>
            <div className="dc-actions-grid">

              {/* Generar QR */}
              <button className="dc-action-btn dc-action-btn--qr" onClick={generarQR} disabled={loadingQR}>
                {loadingQR ? <span className="dc-spinner-sm" /> : <QrIcon />}
                Generar código QR
              </button>

              {/* Iniciar servicio */}
              {cita.estado === 'asignado' && (
                <button
                  className="dc-action-btn dc-action-btn--iniciar"
                  onClick={() => actualizarEstado('en_proceso')}
                  disabled={loadingEst}
                >
                  {loadingEst ? <span className="dc-spinner-sm" /> : <CheckIcon />}
                  Iniciar servicio
                </button>
              )}

              {/* Registrar resultado */}
              {cita.estado === 'en_proceso' && (
                <button
                  className="dc-action-btn dc-action-btn--completar"
                  onClick={() => setModalRes(true)}
                >
                  <CheckIcon />
                  Registrar resultado
                </button>
              )}

              {/* Cancelar */}
              <button
                className="dc-action-btn dc-action-btn--cancelar"
                onClick={() => actualizarEstado('cancelado')}
                disabled={loadingEst}
              >
                <CloseIcon />
                Cancelar servicio
              </button>

            </div>
          </div>
        )}

      </div>

      {/* Modales */}
      {modalQR && (
        <ModalQR
          token={qrToken}
          expiracion={qrExpiracion}
          onClose={() => setModalQR(false)}
          onRefresh={generarQR}
          loadingQR={loadingQR}
        />
      )}

      {modalRes && (
        <ModalResultado
          onClose={() => setModalRes(false)}
          onSubmit={registrarResultado}
          loading={loadingRes}
        />
      )}

    </TecnicoLayout>
  )
}