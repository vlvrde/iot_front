import './Hero.css'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero">
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src="/iot.mp4" type="video/mp4" />
      </video>

      <div className="hero-overlay" />

      <div className="hero-content">

        {/* Eyebrow */}
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          BIENVENIDO A IoTech
        </div>

        {/* Título principal */}
        <h1>
          Transforma tu casa en un<br />
          <span className="hero-accent">hogar inteligente</span>
        </h1>

        {/* Servicios en línea */}
        <div className="hero-services">
          <span>Compra</span>
          <span className="hero-sep">—</span>
          <span>Instalación</span>
          <span className="hero-sep">—</span>
          <span>Mantenimiento</span>
        </div>

        {/* Descripción */}
        <p>
          Dispositivos IoT con técnicos certificados en toda la Ciudad de México.
        </p>

        {/* Stats rápidos */}
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>500+</strong>
            <span>Servicios completados</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <strong>24/7</strong>
            <span>Monitoreo activo</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <strong>100%</strong>
            <span>Técnicos certificados</span>
          </div>
        </div>

      </div>
    </section>
  )
}