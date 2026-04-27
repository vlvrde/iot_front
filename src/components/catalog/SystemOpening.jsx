import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import iotImg from '../../assets/images/system.png'
import './SystemOpening.css'

/* ── Navbar negra ── */
const BLACK_THEME = {
  gradStart: '#111111',
  gradEnd:   '#000000',
  accent:    '#e5e5e5',
  btnBg:     '#ffffff',
  btnColor:  '#111111',
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.so-reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('so-revealed')
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
    title: 'Solicitud desde la app',
    description: 'Envía el comando de apertura o cierre desde tu smartphone en cualquier momento y lugar.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Apertura instantánea',
    description: 'El sistema recibe la señal y acciona el motor del zaguán en menos de un segundo.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="2" width="18" height="20" rx="1"/>
        <path d="M9 2v20"/>
        <circle cx="6.5" cy="12" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Control con Alexa',
    description: 'Di "Alexa, abre el zaguán" y el sistema responde al instante sin tocar el teléfono.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Registro de accesos',
    description: 'Cada apertura y cierre queda registrado con fecha, hora y origen para mayor seguridad.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
]

const features = [
  { label: 'Apertura y cierre remoto' },
  { label: 'Activación por voz con Alexa' },
  { label: 'Registro de cada acceso' },
  { label: 'Instalación certificada incluida' },
  { label: 'Control desde cualquier lugar' },
  { label: 'Historial en plataforma' },
  { label: 'Técnico verificado por QR' },
  { label: 'Soporte post-instalación' },
]

export default function SystemOpening() {
  useReveal()

  return (
    <>
      <Navbar accentColor={BLACK_THEME} />

      {/* ════ HERO ════ */}
      <section className="so-hero">
        <div className="so-hero-bg" />

        <div className="so-hero-inner">
          <div className="so-hero-left">
            <span className="so-tag">DISPOSITIVO IoT</span>
            <h1>
              Apertura de<br />
              <em>Zaguán</em>
            </h1>
            <p>
              Abre y cierra tu zaguán de forma remota y segura desde cualquier lugar.
              Compatible con Alexa y con registro de todos los accesos.
            </p>
            <div className="so-hero-actions">
              <Link to="/carrito" className="so-cta">
                Solicitar instalación
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <a href="#como-funciona" className="so-ghost">Ver cómo funciona</a>
            </div>
          </div>

          <div className="so-hero-right">
            <div className="so-img-ring so-ring-3" />
            <div className="so-img-ring so-ring-2" />
            <div className="so-img-ring so-ring-1" />
            <div className="so-img-core">
              <img src={iotImg} alt="Sistema de Apertura de Zaguán IoTech" />
            </div>
            <div className="so-float-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Instalación incluida
            </div>
          </div>
        </div>

        <div className="so-stats">
          {[
            { value: '< 1s',  label: 'Tiempo de respuesta' },
            { value: '24/7',  label: 'Control activo' },
            { value: '100%',  label: 'Técnicos certificados' },
          ].map((s, i) => (
            <div className="so-stat" key={i}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════ CÓMO FUNCIONA ════ */}
      <section className="so-how" id="como-funciona">
        <div className="so-container">
          <div className="so-section-head so-reveal">
            <span className="so-tag so-tag--light">PROCESO</span>
            <h2>¿Cómo <span className="so-white">funciona</span>?</h2>
            <p>Del comando a tu zaguán en menos de un segundo.</p>
          </div>

          <div className="so-steps-wrap">
            {steps.map(({ number, title, description, Icon }, i) => (
              <div className="so-step so-reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="so-step-num">{number}</div>
                <div className="so-step-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CARACTERÍSTICAS ════ */}
      <section className="so-chars">
        <div className="so-container so-chars-grid">

          <div className="so-chars-visual so-reveal">
            <div className="so-chars-img-bg" />
            <img src={iotImg} alt="Características Sistema de Apertura" className="so-chars-img" />
            <div className="so-chars-qr-card">
              <div className="so-chars-qr-icon">
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

          <div className="so-chars-content so-reveal" style={{ transitionDelay: '0.15s' }}>
            <span className="so-tag so-tag--light">CARACTERÍSTICAS</span>
            <h2>Todo lo que <span className="so-accent-dark">necesitas</span></h2>
            <p>
              Diseñado para darte control total sobre el acceso a tu hogar,
              con instalación rápida, técnicos certificados y soporte continuo.
            </p>
            <ul className="so-feat-list">
              {features.map((f, i) => (
                <li key={i} className="so-reveal" style={{ transitionDelay: `${0.15 + i * 0.06}s` }}>
                  <span className="so-feat-dot" />
                  {f.label}
                </li>
              ))}
            </ul>
            <Link to="/carrito" className="so-cta">
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