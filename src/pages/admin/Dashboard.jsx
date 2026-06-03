import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import bgImage from '../../assets/images/background.png'
import './Dashboard.css'

/* ── Iconos ── */
const Icons = {
  total:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  pendiente:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  completado: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  tecnicos:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  arrow:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  map:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  sol:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  users:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
}

const ESTADO_COLOR = {
  pendiente:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.10)',  label: 'Pendiente'  },
  asignado:   { color: '#6366f1', bg: 'rgba(99,102,241,0.10)',  label: 'Asignado'   },
  en_proceso: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)',  label: 'En proceso' },
  completado: { color: '#10B981', bg: 'rgba(16,185,129,0.10)',  label: 'Completado' },
  cancelado:  { color: '#EF4444', bg: 'rgba(239,68,68,0.10)',   label: 'Cancelado'  },
}

const DISP_LABEL = {
  sensor_gas:       'Sensor de Gas',
  sensor_agua:      'Sensor de Agua',
  sistema_apertura: 'Sistema de Apertura',
}

const ACCESOS = [
  { label: 'Solicitudes', desc: 'Gestionar y asignar tickets', ruta: '/admin/solicitudes', icon: Icons.sol,   color: '#E63946' },
  { label: 'Mapa',        desc: 'Ver incidencias en tiempo real', ruta: '/admin/mapa',    icon: Icons.map,   color: '#6366f1' },
  { label: 'Técnicos',    desc: 'Gestionar el equipo técnico', ruta: '/admin/tecnicos', icon: Icons.users, color: '#10B981' },
]

export default function AdminDashboard() {
  const { authHeaders } = useAuth()
  const navigate = useNavigate()
  const [metricas, setMetricas] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    const API     = import.meta.env.VITE_API_URL
    const headers = authHeaders()
    fetch(`${API}/admin/metricas`, { headers })
      .then(r => r.json())
      .then(data => setMetricas(data.metricas))
      .catch(() => setError('No se pudieron cargar las métricas.'))
      .finally(() => setLoading(false))
  }, [])

  const t = metricas?.totales

  return (
    <AdminLayout titulo="Dashboard">

      {/* ══ HERO ══ */}
      <div className="ad-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="ad-hero-overlay" />
        <div className="ad-hero-body">
          <span className="ad-hero-eyebrow">Panel de administración · IoTech</span>
          <h1 className="ad-hero-title">Resumen operativo</h1>
          <p className="ad-hero-sub">Monitorea el estado de las solicitudes y el equipo técnico.</p>
        </div>
      </div>

      {/* ══ KPIs PRINCIPALES ══ */}
      <div className="ad-kpis">
        {[
          { label: 'Total solicitudes', value: t?.total       ?? '—', icon: Icons.total,      color: '#0A0F1E' },
          { label: 'Pendientes',        value: t?.pendientes   ?? '—', icon: Icons.pendiente,  color: '#F59E0B' },
          { label: 'Completadas',       value: t?.completadas  ?? '—', icon: Icons.completado, color: '#10B981' },
          { label: 'Técnicos activos',  value: metricas?.porTecnico?.length ?? '—', icon: Icons.tecnicos, color: '#6366f1' },
        ].map((k, i) => (
          <div key={i} className="ad-kpi">
            <div className="ad-kpi-icon" style={{ color: k.color, background: `${k.color}12` }}>
              {k.icon}
            </div>
            <div className="ad-kpi-info">
              <span className="ad-kpi-label">{k.label}</span>
              <strong className="ad-kpi-val" style={{ color: k.color }}>
                {loading ? '—' : k.value}
              </strong>
            </div>
          </div>
        ))}
      </div>

      {/* ══ FILA: Estados + Dispositivos ══ */}
      <div className="ad-row">

        {/* Solicitudes por estado */}
        <div className="ad-card">
          <div className="ad-card-header">
            <h3 className="ad-card-title">Por estado</h3>
            <button className="ad-card-link" onClick={() => navigate('/admin/solicitudes')}>
              Ver todas {Icons.arrow}
            </button>
          </div>
          {loading ? <p className="ad-loading">Cargando…</p> : error ? (
            <p className="ad-error-sm">{error}</p>
          ) : (
            <div className="ad-estados">
              {Object.entries({
                pendiente:  t?.pendientes  || 0,
                asignado:   t?.asignadas   || 0,
                en_proceso: t?.en_proceso  || 0,
                completado: t?.completadas || 0,
                cancelado:  t?.canceladas  || 0,
              }).map(([estado, count]) => {
                const cfg   = ESTADO_COLOR[estado]
                const total = t?.total || 1
                const pct   = Math.round((count / total) * 100)
                return (
                  <div key={estado} className="ad-estado-row">
                    <div className="ad-estado-left">
                      <span className="ad-estado-dot" style={{ background: cfg.color }} />
                      <span className="ad-estado-label">{cfg.label}</span>
                    </div>
                    <div className="ad-estado-bar-wrap">
                      <div className="ad-estado-bar">
                        <div className="ad-estado-fill"
                          style={{ width: `${pct}%`, background: cfg.color }} />
                      </div>
                    </div>
                    <span className="ad-estado-count" style={{ color: cfg.color }}>{count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Por tipo de dispositivo */}
        <div className="ad-card">
          <div className="ad-card-header">
            <h3 className="ad-card-title">Por dispositivo</h3>
          </div>
          {loading ? <p className="ad-loading">Cargando…</p> : (
            <div className="ad-dispositivos">
              {(metricas?.porDispositivo || []).map((d, i) => {
                const colors = ['#E63946', '#6366f1', '#10B981']
                const pct    = Math.round((d.total / (t?.total || 1)) * 100)
                return (
                  <div key={i} className="ad-disp-row">
                    <div className="ad-disp-dot" style={{ background: colors[i % 3] }} />
                    <span className="ad-disp-label">{DISP_LABEL[d.tipo] || d.tipo}</span>
                    <div className="ad-disp-bar">
                      <div style={{ width: `${pct}%`, background: colors[i % 3] }} />
                    </div>
                    <span className="ad-disp-val">{d.total}</span>
                  </div>
                )
              })}
              {(!metricas?.porDispositivo || metricas.porDispositivo.length === 0) && (
                <p className="ad-loading">Sin datos aún.</p>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ══ TÉCNICOS ══ */}
      <div className="ad-card ad-card--full">
        <div className="ad-card-header">
          <h3 className="ad-card-title">Desempeño de técnicos</h3>
          <button className="ad-card-link" onClick={() => navigate('/admin/tecnicos')}>
            Gestionar {Icons.arrow}
          </button>
        </div>
        {loading ? <p className="ad-loading">Cargando…</p> : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Técnico</th>
                  <th>Total servicios</th>
                  <th>Completados</th>
                  <th>Activos ahora</th>
                  <th>Tasa éxito</th>
                </tr>
              </thead>
              <tbody>
                {(metricas?.porTecnico || []).map((t2, i) => {
                  const tasa = t2.total_servicios > 0
                    ? Math.round((t2.completados / t2.total_servicios) * 100)
                    : 0
                  return (
                    <tr key={i}>
                      <td className="ad-table-name">
                        <div className="ad-table-avatar">{t2.nombre?.charAt(0)}</div>
                        {t2.nombre} {t2.paterno}
                      </td>
                      <td><span className="ad-table-num">{t2.total_servicios}</span></td>
                      <td><span className="ad-table-num ad-table-num--green">{t2.completados}</span></td>
                      <td><span className="ad-table-num ad-table-num--blue">{t2.activos}</span></td>
                      <td>
                        <div className="ad-tasa">
                          <div className="ad-tasa-bar">
                            <div style={{ width: `${tasa}%` }} />
                          </div>
                          <span>{tasa}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {(!metricas?.porTecnico || metricas.porTecnico.length === 0) && (
                  <tr><td colSpan="5" className="ad-loading">Sin técnicos registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ══ ACCESOS RÁPIDOS ══ */}
      <div className="ad-accesos">
        {ACCESOS.map(a => (
          <button key={a.ruta} className="ad-acceso" onClick={() => navigate(a.ruta)}
            style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="ad-acceso-overlay" />
            <div className="ad-acceso-content">
              <div className="ad-acceso-icon" style={{ color: a.color }}>{a.icon}</div>
              <span className="ad-acceso-label">{a.label}</span>
              <span className="ad-acceso-desc">{a.desc}</span>
            </div>
            <div className="ad-acceso-arrow">{Icons.arrow}</div>
          </button>
        ))}
      </div>

    </AdminLayout>
  )
}