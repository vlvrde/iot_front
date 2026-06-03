import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './ClienteLayout.css'

const Icon = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  solicitudes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  dispositivos: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  historial: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  qr: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <path d="M14 14h2v2h-2zM18 14h3M14 18h1M17 18h3M20 21v-3"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
}

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Inicio',           icon: Icon.dashboard,    ruta: '/cliente/dashboard'    },
  { id: 'solicitudes',  label: 'Mis Solicitudes',  icon: Icon.solicitudes,  ruta: '/cliente/solicitudes'  },
  { id: 'dispositivos', label: 'Mis Dispositivos', icon: Icon.dispositivos, ruta: '/cliente/dispositivos' },
  { id: 'historial',    label: 'Historial',        icon: Icon.historial,    ruta: '/cliente/historial'    },
  { id: 'validar-qr',  label: 'Validar QR',       icon: Icon.qr,           ruta: '/cliente/validar-qr'   },
]

export default function ClienteLayout({ children, titulo }) {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [sideOpen, setSideOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Detectar sección activa por ruta
  const seccionActiva = NAV_ITEMS.find(n => location.pathname.startsWith(n.ruta))?.id || 'dashboard'

  return (
    <div className="cl-root">

      {/* Overlay móvil */}
      {sideOpen && (
        <div className="cl-overlay" onClick={() => setSideOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`cl-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="cl-sidebar-brand">
          <h2>Panel Cliente</h2>
          <span>IoTech Support</span>
        </div>

        <div className="cl-sidebar-user">
          <div className="cl-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="cl-sidebar-user-info">
            <strong>{user?.nombre} {user?.paterno}</strong>
            <span>Cliente</span>
          </div>
        </div>

        <nav className="cl-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`cl-nav-item ${seccionActiva === item.id ? 'active' : ''}`}
              onClick={() => {
                navigate(item.ruta)
                setSideOpen(false)
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="cl-sidebar-footer">
          <button className="cl-logout-btn" onClick={handleLogout}>
            {Icon.logout}
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="cl-main">

        <section className="cl-content">
          {children}
        </section>
      </main>

    </div>
  )
}