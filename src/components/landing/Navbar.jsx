import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'

const DASHBOARD_POR_ROL = {
  cliente:       '/cliente/dashboard',
  tecnico:       '/tecnico/citas',
  administrador: '/admin/dashboard',
}

export default function Navbar({ accentColor }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const closeTimer = useRef(null)
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current)
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150)
  }

  const handleAccesoBtn = () => {
    if (isAuthenticated && user?.rol) {
      navigate(DASHBOARD_POR_ROL[user.rol] || '/cliente/dashboard')
    } else {
      navigate('/login')
    }
  }

  const style = accentColor ? {
    '--nb-grad-start': accentColor.gradStart,
    '--nb-grad-end':   accentColor.gradEnd,
    '--nb-accent':     accentColor.accent,
    '--nb-btn-bg':     accentColor.btnBg,
    '--nb-btn-color':  accentColor.btnColor ?? '#fff',
  } : {}

  return (
    <header className="navbar" style={style}>
      <div className="navbar-top">
        <div className="navbar-logo">
          <Link to="/">IoT<span>ech</span></Link>
        </div>

        <div className="navbar-search-box">
          <input type="text" placeholder="Busca por dispositivo o descripción" />
          <button className="search-icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>

        <button className="navbar-param-btn">Buscar</button>
      </div>

      <div className="navbar-bottom">
        <div className="navbar-menu">

          <div
            className="navbar-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="navbar-dropdown-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              Catálogo
            </button>

            {dropdownOpen && (
              <div className="navbar-dropdown-bridge">
                <div className="navbar-dropdown-content">
                  <Link to="/catalogo/sensor-gas">Sensor de gas</Link>
                  <Link to="/catalogo/sensor-agua">Sensor de agua</Link>
                  <Link to="/catalogo/apertura-zaguan">Apertura de zaguán</Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/sucursales" className="cart-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Sucursales
          </Link>
        </div>

        <div className="navbar-actions">
          <Link to="/carrito" className="cart-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>

          <button className="navbar-btn-access" onClick={handleAccesoBtn}>
            {isAuthenticated ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
                Mi Dashboard
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Acceso A Miembros
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}