import { useState, useEffect } from 'react'
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
  config: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
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
  { id: 'citas',  label: 'Mis Citas',     icon: Icon.citas,  ruta: '/tecnico/citas'         },
  { id: 'config', label: 'Configuración', icon: Icon.config, ruta: '/tecnico/configuracion' },
]

export default function TecnicoLayout({ children }) {
  const { user, logout, authHeaders } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [sideOpen, setSideOpen] = useState(false)
  const [foto,     setFoto]     = useState(null)

  const API = import.meta.env.VITE_API_URL

  // Cargar foto de perfil al montar
  useEffect(() => {
    fetch(`${API}/tecnico/perfil`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '')
        if (data.perfil.foto) setFoto(`${BASE_URL}${data.perfil.foto}`)      })
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const seccionActiva = NAV_ITEMS.find(n => location.pathname.startsWith(n.ruta))?.id || 'citas'

  return (
    <div className="tl-root">

      {sideOpen && <div className="tl-overlay" onClick={() => setSideOpen(false)} />}

      <button className="tl-hamburger" onClick={() => setSideOpen(s => !s)} aria-label="Abrir menú">
        {sideOpen ? Icon.close : Icon.menu}
      </button>

      {/* ── Sidebar ── */}
      <aside className={`tl-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="tl-brand">
          <div className="tl-brand-icon">{Icon.wrench}</div>
          <div>
            <h2>Panel Técnico</h2>
            <span>IoTech Support</span>
          </div>
        </div>

        {/* Usuario con foto */}
        <div className="tl-user">
          <div className="tl-avatar">
            {foto
              ? <img src={foto} alt="Foto de perfil" className="tl-avatar-img" />
              : <span>{user?.nombre?.charAt(0).toUpperCase()}</span>
            }
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

      <main className="tl-main">
        {children}
      </main>

    </div>
  )
}