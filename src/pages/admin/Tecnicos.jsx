import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import bgImage from '../../assets/images/background.png'
import './Tecnicos.css'

/* ── Íconos ── */
const Ico = {
  plus:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  edit:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  off:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  on:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  check:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  map:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  mail:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>,
}

/* ── Helpers ── */
const CAMPOS_REQUERIDOS = ['nombre','paterno','email','password','calle','num_exterior','codigo_postal','colonia','delegacion','estado_dir']

function camposValidos(form, esEdicion) {
  const requeridos = esEdicion
    ? CAMPOS_REQUERIDOS.filter(c => c !== 'password')
    : CAMPOS_REQUERIDOS
  return requeridos.every(c => form[c]?.trim())
}

const FORM_INICIAL = {
  nombre: '', paterno: '', materno: '', email: '', telefono: '', password: '',
  calle: '', num_exterior: '', num_interior: '', codigo_postal: '',
  colonia: '', delegacion: '', estado_dir: 'Ciudad de México',
}

/* ══════════════════════════════════════════════════════════════
   MODAL — Crear / Editar técnico
   ══════════════════════════════════════════════════════════════ */
function ModalTecnico({ tecnico, onClose, onSuccess, authHeaders }) {
  const esEdicion = !!tecnico
  const [form,    setForm]    = useState(esEdicion ? {
    ...FORM_INICIAL,
    nombre:      tecnico.nombre      || '',
    paterno:     tecnico.paterno     || '',
    materno:     tecnico.materno     || '',
    email:       tecnico.email       || '',
    telefono:    tecnico.telefono    || '',
    calle:       tecnico.calle       || '',
    num_exterior: tecnico.num_exterior || '',
    num_interior: tecnico.num_interior || '',
    codigo_postal: tecnico.codigo_postal || '',
    colonia:     tecnico.colonia     || '',
    delegacion:  tecnico.delegacion  || '',
    estado_dir:  tecnico.estado      || 'Ciudad de México',
    password:    '',
  } : { ...FORM_INICIAL })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!camposValidos(form, esEdicion)) {
      setError('Completa todos los campos obligatorios (*).')
      return
    }
    setLoading(true); setError('')
    try {
      const API = import.meta.env.VITE_API_URL
      const url = esEdicion
        ? `${API}/admin/tecnicos/${tecnico.id}`
        : `${API}/admin/tecnicos`
      const method = esEdicion ? 'PUT' : 'POST'

      const body = { ...form, estado: form.estado_dir }
      if (esEdicion && !body.password) delete body.password

      const res  = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al guardar.')
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tc-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tc-modal">

        <div className="tc-modal-header">
          <h2>{esEdicion ? 'Editar técnico' : 'Nuevo técnico'}</h2>
          <button className="tc-modal-close" onClick={onClose}>{Ico.close}</button>
        </div>

        {error && <div className="tc-modal-error">{error}</div>}

        <form className="tc-modal-form" onSubmit={handleSubmit}>

          <p className="tc-modal-section">Datos personales</p>
          <div className="tc-grid">
            <div className="tc-field">
              <label>Nombre *</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan" />
            </div>
            <div className="tc-field">
              <label>Apellido paterno *</label>
              <input name="paterno" value={form.paterno} onChange={handleChange} placeholder="García" />
            </div>
            <div className="tc-field">
              <label>Apellido materno</label>
              <input name="materno" value={form.materno} onChange={handleChange} placeholder="López" />
            </div>
            <div className="tc-field">
              <label>Correo electrónico *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="tecnico@iotech.com" disabled={esEdicion} />
            </div>
            <div className="tc-field">
              <label>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="5512345678" />
            </div>
            <div className="tc-field">
              <label>{esEdicion ? 'Nueva contraseña' : 'Contraseña *'}</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder={esEdicion ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'} minLength={esEdicion ? 0 : 8} />
            </div>
          </div>

          <p className="tc-modal-section">Domicilio</p>
          <div className="tc-grid">
            <div className="tc-field tc-field--full">
              <label>Calle *</label>
              <input name="calle" value={form.calle} onChange={handleChange} placeholder="Av. Principal" />
            </div>
            <div className="tc-field">
              <label>Núm. exterior *</label>
              <input name="num_exterior" value={form.num_exterior} onChange={handleChange} placeholder="123" />
            </div>
            <div className="tc-field">
              <label>Núm. interior</label>
              <input name="num_interior" value={form.num_interior} onChange={handleChange} placeholder="A" />
            </div>
            <div className="tc-field">
              <label>Código postal *</label>
              <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} placeholder="06600" maxLength={5} />
            </div>
            <div className="tc-field">
              <label>Colonia *</label>
              <input name="colonia" value={form.colonia} onChange={handleChange} placeholder="Centro" />
            </div>
            <div className="tc-field">
              <label>Alcaldía / Municipio *</label>
              <input name="delegacion" value={form.delegacion} onChange={handleChange} placeholder="Cuauhtémoc" />
            </div>
            <div className="tc-field">
              <label>Estado *</label>
              <input name="estado_dir" value={form.estado_dir} onChange={handleChange} placeholder="Ciudad de México" />
            </div>
          </div>

          <div className="tc-modal-actions">
            <button type="button" className="tc-btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="tc-btn-submit" disabled={loading}>
              {loading ? <span className="tc-spinner" /> : <>{Ico.check} {esEdicion ? 'Guardar cambios' : 'Crear técnico'}</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MODAL — Confirmar desactivar / reactivar
   ══════════════════════════════════════════════════════════════ */
function ModalConfirmar({ tecnico, onClose, onSuccess, authHeaders }) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const desactivar = tecnico.activo

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const API    = import.meta.env.VITE_API_URL
      const accion = desactivar ? 'desactivar' : 'reactivar'
      const res    = await fetch(`${API}/admin/tecnicos/${tecnico.id}/${accion}`, {
        method: 'PUT', headers: authHeaders(),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error.')
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tc-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tc-modal tc-modal--sm">
        <div className="tc-modal-header">
          <h2>{desactivar ? 'Desactivar técnico' : 'Reactivar técnico'}</h2>
          <button className="tc-modal-close" onClick={onClose}>{Ico.close}</button>
        </div>
        <div className="tc-confirm-body">
          {desactivar ? (
            <p>¿Seguro que deseas desactivar a <strong>{tecnico.nombre} {tecnico.paterno}</strong>?
              Sus solicitudes asignadas volverán a estado <em>pendiente</em>.</p>
          ) : (
            <p>¿Deseas reactivar a <strong>{tecnico.nombre} {tecnico.paterno}</strong>?
              Podrá volver a recibir solicitudes.</p>
          )}
          {error && <div className="tc-modal-error">{error}</div>}
        </div>
        <div className="tc-modal-actions" style={{ padding: '0 1.8rem 1.6rem' }}>
          <button className="tc-btn-cancel" onClick={onClose}>Cancelar</button>
          <button
            className={`tc-btn-submit ${desactivar ? 'tc-btn-danger' : ''}`}
            onClick={handleConfirm} disabled={loading}>
            {loading ? <span className="tc-spinner" /> : desactivar ? 'Sí, desactivar' : 'Sí, reactivar'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
   ══════════════════════════════════════════════════════════════ */
export default function AdminTecnicos() {
  const { authHeaders } = useAuth()

  const [tecnicos, setTecnicos] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [filtroActivo, setFiltroActivo] = useState('todos')  // todos | activos | inactivos

  const [modalNuevo,   setModalNuevo]   = useState(false)
  const [modalEditar,  setModalEditar]  = useState(null)
  const [modalConfirm, setModalConfirm] = useState(null)

  const cargarTecnicos = useCallback(() => {
    const API = import.meta.env.VITE_API_URL
    setLoading(true)
    fetch(`${API}/admin/tecnicos`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setTecnicos(data.tecnicos || []))
      .catch(() => setError('No se pudieron cargar los técnicos.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { cargarTecnicos() }, [cargarTecnicos])

  const handleExito = () => {
    setModalNuevo(false); setModalEditar(null); setModalConfirm(null)
    cargarTecnicos()
  }

  const tecnicosFiltrados = tecnicos.filter(t => {
    if (filtroActivo === 'activos')   return t.activo === 1
    if (filtroActivo === 'inactivos') return t.activo === 0
    return true
  })

  const activos   = tecnicos.filter(t => t.activo === 1).length
  const inactivos = tecnicos.filter(t => t.activo === 0).length

  return (
    <AdminLayout titulo="Técnicos">

      {/* Hero */}
      <div className="tc-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="tc-hero-overlay" />
        <div className="tc-hero-body">
          <span className="tc-hero-eyebrow">Panel de administración · IoTech</span>
          <h1 className="tc-hero-title">Gestión de Técnicos</h1>
          <p className="tc-hero-sub">
            {loading ? '…' : `${activos} activo${activos !== 1 ? 's' : ''} · ${inactivos} inactivo${inactivos !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Header con tabs + botón nuevo */}
      <div className="tc-header">
        <div className="tc-tabs">
          {[
            { id: 'todos',     label: `Todos (${tecnicos.length})`     },
            { id: 'activos',   label: `Activos (${activos})`           },
            { id: 'inactivos', label: `Inactivos (${inactivos})`       },
          ].map(tab => (
            <button key={tab.id}
              className={`tc-tab ${filtroActivo === tab.id ? 'active' : ''}`}
              onClick={() => setFiltroActivo(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
        <button className="tc-btn-new" onClick={() => setModalNuevo(true)}>
          {Ico.plus} Nuevo técnico
        </button>
      </div>

      {/* Estados */}
      {loading && <div className="tc-loading">Cargando técnicos…</div>}
      {error   && <div className="tc-error">{error}</div>}

      {/* Grid de tarjetas */}
      {!loading && !error && (
        tecnicosFiltrados.length === 0 ? (
          <div className="tc-empty">
            <p>No hay técnicos {filtroActivo !== 'todos' ? `${filtroActivo}` : 'registrados'}.</p>
            {filtroActivo === 'todos' && (
              <button className="tc-btn-new" onClick={() => setModalNuevo(true)}>
                {Ico.plus} Crear primer técnico
              </button>
            )}
          </div>
        ) : (
          <div className="tc-grid-cards">
            {tecnicosFiltrados.map(t => (
              <div key={t.id} className={`tc-card ${!t.activo ? 'tc-card--inactive' : ''}`}>

                {/* Avatar + estado */}
                <div className="tc-card-top">
                  <div className="tc-card-avatar">
                    {t.nombre?.charAt(0)}{t.paterno?.charAt(0)}
                  </div>
                  <span className={`tc-card-status ${t.activo ? 'tc-card-status--on' : 'tc-card-status--off'}`}>
                    {t.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Nombre */}
                <div className="tc-card-name">
                  <strong>{t.nombre} {t.paterno} {t.materno}</strong>
                </div>

                {/* Info */}
                <div className="tc-card-info">
                  <span>{Ico.mail} {t.email}</span>
                  {t.telefono && <span>{Ico.phone} {t.telefono}</span>}
                  <span>{Ico.map} {t.colonia}, {t.delegacion}</span>
                </div>

                {/* Métricas */}
                <div className="tc-card-metrics">
                  <div className="tc-metric-pill tc-metric-pill--blue">
                    <span>{t.solicitudes_activas}</span>
                    <label>Activas</label>
                  </div>
                </div>

                {/* Acciones */}
                <div className="tc-card-actions">
                  <button className="tc-action-btn tc-action-btn--edit"
                    onClick={() => setModalEditar(t)} title="Editar">
                    {Ico.edit} Editar
                  </button>
                  <button
                    className={`tc-action-btn ${t.activo ? 'tc-action-btn--off' : 'tc-action-btn--on'}`}
                    onClick={() => setModalConfirm(t)}
                    title={t.activo ? 'Desactivar' : 'Reactivar'}>
                    {t.activo ? <>{Ico.off} Desactivar</> : <>{Ico.on} Reactivar</>}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )
      )}

      {/* Modales */}
      {modalNuevo && (
        <ModalTecnico onClose={() => setModalNuevo(false)} onSuccess={handleExito} authHeaders={authHeaders} />
      )}
      {modalEditar && (
        <ModalTecnico tecnico={modalEditar} onClose={() => setModalEditar(null)} onSuccess={handleExito} authHeaders={authHeaders} />
      )}
      {modalConfirm && (
        <ModalConfirmar tecnico={modalConfirm} onClose={() => setModalConfirm(null)} onSuccess={handleExito} authHeaders={authHeaders} />
      )}

    </AdminLayout>
  )
}