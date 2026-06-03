import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './TecnicoLayout.css'

const Icon = {
  citas: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
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
  wrench: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
}

const NAV_ITEMS = [
  { id: 'citas', label: 'Mis Citas',    icon: Icon.citas,  ruta: '/tecnico/citas'    },
  { id: 'qr',    label: 'Generar QR',  icon: Icon.qr,     ruta: '/tecnico/qr'       },
]

export default function TecnicoLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [sideOpen, setSideOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const seccionActiva = NAV_ITEMS.find(n => location.pathname.startsWith(n.ruta))?.id || 'citas'

  return (
    <div className="tl-root">

      {sideOpen && (
        <div className="tl-overlay" onClick={() => setSideOpen(false)} />
      )}

      <button className="tl-hamburger" onClick={() => setSideOpen(s => !s)} aria-label="Abrir menú">
        {sideOpen ? Icon.close : Icon.menu}
      </button>

      {/* ── Sidebar azul petróleo ── */}
      <aside className={`tl-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="tl-brand">
          <div className="tl-brand-icon">{Icon.wrench}</div>
          <div>
            <h2>Panel Técnico</h2>
            <span>IoTech Support</span>
          </div>
        </div>

        <div className="tl-user">
          <div className="tl-avatar">
            {user?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="tl-user-info">
            <strong>{user?.nombre} {user?.paterno}</strong>
            <span>Técnico certificado</span>
          </div>
        </div>

        <nav className="tl-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`tl-nav-item ${seccionActiva === item.id ? 'active' : ''}`}
              onClick={() => { navigate(item.ruta); setSideOpen(false) }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="tl-footer">
          <button className="tl-logout" onClick={handleLogout}>
            {Icon.logout}
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <main className="tl-main">
        {children}
      </main>

    </div>
  )
}