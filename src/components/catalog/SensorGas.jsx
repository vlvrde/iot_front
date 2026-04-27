import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import fireImg from '../../assets/images/fire.png'
import './SensorGas.css'

/* ── Color rojo para la Navbar ── */
const RED_THEME = {
  gradStart: '#b91c1c',
  gradEnd:   '#7f1d1d',
  accent:    '#fca5a5',
  btnBg:     '#fca5a5',
  btnColor:  '#7f1d1d',
}

/* ── Hook para animaciones al hacer scroll ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.sg-reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('sg-revealed')
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
    description: 'El sensor analiza el ambiente en tiempo real, detectando mínimas concentraciones de gas LP y natural.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Alerta inmediata',
    description: 'Ante cualquier anomalía, recibes una notificación push en tu teléfono en menos de 3 segundos.',
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
    description: 'Consulta el estado del sensor, silencia alarmas o activa protocolos de emergencia con tu voz.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Registro en plataforma',
    description: 'Cada evento queda registrado con fecha, hora y nivel de concentración para análisis posterior.',
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
  { label: 'Detección de gas LP y natural' },
  { label: 'Alertas push en < 3 segundos' },
  { label: 'Compatible con Amazon Alexa' },
  { label: 'Instalación certificada incluida' },
  { label: 'Monitoreo 24/7 desde la app' },
  { label: 'Historial de incidencias' },
  { label: 'Técnico verificado por QR' },
  { label: 'Soporte post-instalación' },
]

export default function SensorGas() {
  useReveal()

  return (
    <>
      <Navbar accentColor={RED_THEME} />

      {/* ════════════ HERO ════════════ */}
      <section className="sg-hero">
        {/* Fondo con patrón de puntos */}
        <div className="sg-hero-bg" />

        <div className="sg-hero-inner">
          {/* Lado izquierdo */}
          <div className="sg-hero-left">
            <span className="sg-tag">DISPOSITIVO IoT</span>
            <h1>
              Sensor de<br />
              <em>Gas</em>
            </h1>
            <p>
              Protege a tu familia con detección inteligente de fugas.
              Alertas al instante en tu smartphone y control por voz con Alexa.
            </p>
            <div className="sg-hero-actions">
              <Link to="/carrito" className="sg-cta">
                Solicitar instalación
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <a href="#como-funciona" className="sg-ghost">Ver cómo funciona</a>
            </div>
          </div>

          {/* Lado derecho — imagen */}
          <div className="sg-hero-right">
            <div className="sg-img-ring sg-ring-3" />
            <div className="sg-img-ring sg-ring-2" />
            <div className="sg-img-ring sg-ring-1" />
            <div className="sg-img-core">
              <img src={fireImg} alt="Sensor de Gas IoTech" />
            </div>
            {/* Badge flotante */}
            <div className="sg-float-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Instalación incluida
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="sg-stats">
          {[
            { value: '< 3s', label: 'Tiempo de alerta' },
            { value: '24/7', label: 'Monitoreo activo' },
            { value: '100%', label: 'Técnicos certificados' },
          ].map((s, i) => (
            <div className="sg-stat" key={i}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ CÓMO FUNCIONA ════════════ */}
      <section className="sg-how" id="como-funciona">
        <div className="sg-container">
          <div className="sg-section-head sg-reveal">
            <span className="sg-tag sg-tag--dark">PROCESO</span>
            <h2>¿Cómo <span className="sg-red">funciona</span>?</h2>
            <p>Del sensor a tu teléfono en segundos.</p>
          </div>

          <div className="sg-steps-wrap">
            {steps.map(({ number, title, description, Icon }, i) => (
              <div
                className="sg-step sg-reveal"
                key={i}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="sg-step-num">{number}</div>
                <div className="sg-step-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{description}</p>
                {i < steps.length - 1 && <div className="sg-step-line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CARACTERÍSTICAS ════════════ */}
      <section className="sg-chars">
        <div className="sg-container sg-chars-grid">

          {/* Imagen */}
          <div className="sg-chars-visual sg-reveal">
            <div className="sg-chars-img-bg" />
            <img src={fireImg} alt="Características Sensor de Gas" className="sg-chars-img" />
            <div className="sg-chars-qr-card">
              <div className="sg-chars-qr-icon">
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

          {/* Contenido */}
          <div className="sg-chars-content sg-reveal" style={{ transitionDelay: '0.15s' }}>
            <span className="sg-tag sg-tag--dark">CARACTERÍSTICAS</span>
            <h2>Todo lo que <span className="sg-red">necesitas</span></h2>
            <p>
              Diseñado para integrarse a tu hogar inteligente con instalación rápida,
              técnicos certificados y soporte continuo desde la plataforma.
            </p>

            <ul className="sg-feat-list">
              {features.map((f, i) => (
                <li key={i} className="sg-reveal" style={{ transitionDelay: `${0.15 + i * 0.06}s` }}>
                  <span className="sg-feat-dot" />
                  {f.label}
                </li>
              ))}
            </ul>

            <Link to="/carrito" className="sg-cta">
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