import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import waterImg from '../../assets/images/water.png'
import './SensorWater.css'

/* Navbar sin accentColor = azul por defecto */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.sw-reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('sw-revealed')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.15 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

const steps = [
  {
    number: '01',
    title: 'Monitoreo continuo',
    description: 'El sensor analiza el caudal y humedad en tiempo real, detectando anomalías en tuberías y conexiones.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Alerta inmediata',
    description: 'Ante cualquier fuga o consumo inusual, recibes una notificación push en tu teléfono al instante.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Control con Alexa',
    description: 'Consulta el consumo del día, el estado del sensor o activa cortes de emergencia con tu voz.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Reporte de consumo',
    description: 'Visualiza tu consumo diario, semanal y mensual desde la plataforma para tomar mejores decisiones.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
]

const features = [
  { label: 'Detección de fugas en tuberías' },
  { label: 'Alertas push instantáneas' },
  { label: 'Compatible con Amazon Alexa' },
  { label: 'Instalación certificada incluida' },
  { label: 'Reporte de consumo diario' },
  { label: 'Historial de incidencias' },
  { label: 'Técnico verificado por QR' },
  { label: 'Soporte post-instalación' },
]

export default function SensorWater() {
  useReveal()

  return (
    <>
      <Navbar />

      {/* ════ HERO ════ */}
      <section className="sw-hero">
        <div className="sw-hero-bg" />

        <div className="sw-hero-inner">
          <div className="sw-hero-left">
            <span className="sw-tag">DISPOSITIVO IoT</span>
            <h1>
              Sensor de<br />
              <em>Agua</em>
            </h1>
            <p>
              Detecta fugas, monitorea tu consumo y protege tu hogar de daños
              por agua. Control total desde tu smartphone y con tu voz.
            </p>
            <div className="sw-hero-actions">
              <Link to="/carrito" className="sw-cta">
                Solicitar instalación
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <a href="#como-funciona" className="sw-ghost">Ver cómo funciona</a>
            </div>
          </div>

          <div className="sw-hero-right">
            <div className="sw-img-ring sw-ring-3" />
            <div className="sw-img-ring sw-ring-2" />
            <div className="sw-img-ring sw-ring-1" />
            <div className="sw-img-core">
              <img src={waterImg} alt="Sensor de Agua IoTech" />
            </div>
            <div className="sw-float-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Instalación incluida
            </div>
          </div>
        </div>

        <div className="sw-stats">
          {[
            { value: '< 2s',  label: 'Tiempo de alerta' },
            { value: '24/7',  label: 'Monitoreo activo' },
            { value: '100%',  label: 'Técnicos certificados' },
          ].map((s, i) => (
            <div className="sw-stat" key={i}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════ CÓMO FUNCIONA ════ */}
      <section className="sw-how" id="como-funciona">
        <div className="sw-container">
          <div className="sw-section-head sw-reveal">
            <span className="sw-tag sw-tag--light">PROCESO</span>
            <h2>¿Cómo <span className="sw-blue">funciona</span>?</h2>
            <p>Del sensor a tu teléfono en segundos.</p>
          </div>

          <div className="sw-steps-wrap">
            {steps.map(({ number, title, description, Icon }, i) => (
              <div className="sw-step sw-reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="sw-step-num">{number}</div>
                <div className="sw-step-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CARACTERÍSTICAS ════ */}
      <section className="sw-chars">
        <div className="sw-container sw-chars-grid">

          <div className="sw-chars-visual sw-reveal">
            <div className="sw-chars-img-bg" />
            <img src={waterImg} alt="Características Sensor de Agua" className="sw-chars-img" />
            <div className="sw-chars-qr-card">
              <div className="sw-chars-qr-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <path d="M14 14h2v2h-2zM18 14h3M14 18h1M17 18h3M20 21v-3"/>
                </svg>
              </div>
              <div>
                <strong>Validación QR</strong>
                <p>Verifica a tu técnico antes del servicio</p>
              </div>
            </div>
          </div>

          <div className="sw-chars-content sw-reveal" style={{ transitionDelay: '0.15s' }}>
            <span className="sw-tag sw-tag--light">CARACTERÍSTICAS</span>
            <h2>Todo lo que <span className="sw-blue">necesitas</span></h2>
            <p>
              Diseñado para integrarse a tu hogar inteligente con instalación rápida,
              técnicos certificados y soporte continuo desde la plataforma.
            </p>
            <ul className="sw-feat-list">
              {features.map((f, i) => (
                <li key={i} className="sw-reveal" style={{ transitionDelay: `${0.15 + i * 0.06}s` }}>
                  <span className="sw-feat-dot" />
                  {f.label}
                </li>
              ))}
            </ul>
            <Link to="/carrito" className="sw-cta">
              Solicitar instalación
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </>
  )
}