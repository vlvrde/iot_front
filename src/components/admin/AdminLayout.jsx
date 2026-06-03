import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLayout.css'

const Icon = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  solicitudes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  mapa: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  ),
  tecnicos: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  shield: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
}

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',   icon: Icon.dashboard,   ruta: '/admin/dashboard'   },
  { id: 'solicitudes', label: 'Solicitudes', icon: Icon.solicitudes, ruta: '/admin/solicitudes' },
  { id: 'mapa',        label: 'Mapa',        icon: Icon.mapa,        ruta: '/admin/mapa'        },
  { id: 'tecnicos',    label: 'Técnicos',    icon: Icon.tecnicos,    ruta: '/admin/tecnicos'    },
]

export default function AdminLayout({ children, titulo }) {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [sideOpen, setSideOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login', { replace: true }) }

  const seccionActiva = NAV_ITEMS.find(n => location.pathname.startsWith(n.ruta))?.id || 'dashboard'

  return (
    <div className="al-root">

      {/* Overlay mobile */}
      {sideOpen && <div className="al-overlay" onClick={() => setSideOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`al-sidebar ${sideOpen ? 'open' : ''}`}>

        <div className="al-brand">
          <div className="al-brand-mark">
            <span>A</span>
          </div>
          <div className="al-brand-text">
            <h2>Admin</h2>
            <span>IoTech Panel</span>
          </div>
        </div>

        <div className="al-user">
          <div className="al-user-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="al-user-info">
            <strong>{user?.nombre} {user?.paterno}</strong>
            <span className="al-user-role">{Icon.shield} Administrador</span>
          </div>
        </div>

        <nav className="al-nav">
          <p className="al-nav-label">Navegación</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`al-nav-item ${seccionActiva === item.id ? 'active' : ''}`}
              onClick={() => { navigate(item.ruta); setSideOpen(false) }}
            >
              <span className="al-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {seccionActiva === item.id && <span className="al-nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="al-sidebar-footer">
          <button className="al-logout" onClick={handleLogout}>
            {Icon.logout}
            <span>Cerrar sesión</span>
          </button>
        </div>

      </aside>

      {/* ── Main ── */}
      <div className="al-main">

        {/* Topbar */}
        <header className="al-topbar">
          <div className="al-topbar-left">
            <button className="al-hamburger" onClick={() => setSideOpen(s => !s)} aria-label="Menú">
              {sideOpen ? Icon.close : Icon.menu}
            </button>
            <div>
              <h1 className="al-topbar-title">{titulo || 'Panel'}</h1>
              <p className="al-topbar-date">
                {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="al-topbar-right">
            <span className="al-topbar-badge">{Icon.shield} Admin</span>
          </div>
        </header>

        {/* Contenido */}
        <main className="al-content">
          {children}
        </main>

      </div>
    </div>
  )
}