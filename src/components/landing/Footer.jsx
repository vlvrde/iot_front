import './Footer.css'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <span className="footer-logo">Io<span className="footer-accent">Tech</span></span>
          <p>Plataforma de soporte técnico para dispositivos IoT domésticos en la Ciudad de México.</p>
        </div>

        <div className="footer-links">
          <h4>Servicios</h4>
          <ul>
            <li><Link to="/">Instalación</Link></li>
            <li><Link to="/">Mantenimiento</Link></li>
            <li><Link to="/">Reparación</Link></li>
            <li><Link to="/">Desinstalación</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Plataforma</h4>
          <ul>
            <li><Link to="/login">Acceder</Link></li>
            <li><Link to="/register">Registrarse</Link></li>
            <li><Link to="/">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Dispositivos</h4>
          <ul>
            <li><Link to="/">Sensor de gas</Link></li>
            <li><Link to="/">Sensor de agua</Link></li>
            <li><Link to="/">Apertura de zaguán</Link></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 IoTech · Ciudad de México · Todos los derechos reservados</p>
      </div>

    </footer>
  )
}