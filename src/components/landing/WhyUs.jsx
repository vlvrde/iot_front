import { useState, useEffect } from 'react'
import './WhyUs.css'

import img1 from '../../assets/images/alexa.png'
import img2 from '../../assets/images/tecnicos.png'
import img3 from '../../assets/images/qr.png'

const slides = [
  { id: 1, src: img1, label: 'Instalación de dispositivos' },
  { id: 2, src: img2, label: 'Técnico en field' },
  { id: 3, src: img3, label: 'Soporte certificado' },
]

const reasons = [
  {
    id: 1,
    title: 'Técnicos certificados',
    description: 'Todo nuestro equipo está verificado y capacitado en instalación y mantenimiento de dispositivos IoT.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-2a5 5 0 0 1 5-5h4" />
        <path d="M16 21l5-5-1.5-1.5-1 1-3-3 1-1-1.5-1.5L10 16l3 3-1 1 1.5 1.5 1-1L16 21z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Validación QR de identidad',
    description: 'Antes de cada visita, verifica a tu técnico escaneando su código QR desde la app. Tu seguridad primero.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h2v2h-2zM18 14h3M14 18h1M17 18h3M20 21v-3" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Compatible con Amazon Alexa',
    description: 'Controla tus dispositivos con la voz. Abre el zaguán, revisa sensores y más, todo integrado con Alexa.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Cobertura en toda la CDMX',
    description: 'Monitoreo geográfico en tiempo real de incidencias. Técnicos disponibles en todas las alcaldías.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Soporte post-instalación',
    description: 'Gestiona mantenimientos, reparaciones y desinstalaciones desde la plataforma en cualquier momento.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Alertas en tiempo real',
    description: 'Recibe notificaciones al instante ante cualquier fuga de gas, fuga de agua o acceso no autorizado.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
]

export default function WhyUs() {
  const [current, setCurrent] = useState(0)

  // Auto-avance cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  return (
    <section className="whyus" id="por-que-iotech">
      <div className="whyus-container">

        {/* Carrusel */}
        <div className="whyus-image-col">
          <div className="whyus-carousel">

            <div className="whyus-slides">
              {slides.map((slide, idx) => (
                <div
                  className={`whyus-slide ${idx === current ? 'active' : ''}`}
                  key={slide.id}
                >
                  {slide.src
                    ? <img src={slide.src} alt={slide.label} />
                    : (
                      <div className="whyus-placeholder">
                        <svg viewBox="0 0 80 80" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" width="100" height="100">
                          <circle cx="40" cy="28" r="12" />
                          <path d="M16 68v-4a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16v4" />
                          <path d="M52 38l8-8" strokeWidth="2" stroke="rgba(79,195,247,0.5)" />
                        </svg>
                        <span>{slide.label}</span>
                      </div>
                    )
                  }
                </div>
              ))}
            </div>

            {/* Controles */}
            <button className="whyus-arrow whyus-arrow--prev" onClick={prev} aria-label="Anterior">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="whyus-arrow whyus-arrow--next" onClick={next} aria-label="Siguiente">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Dots */}
            <div className="whyus-dots">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  className={`whyus-dot ${idx === current ? 'active' : ''}`}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Imagen ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Contenido */}
        <div className="whyus-content-col">
          <span className="whyus-eyebrow">POR QUÉ ELEGIRNOS</span>
          <h2>Tu hogar inteligente,<br /><span className="whyus-accent">en manos seguras</span></h2>
          <p className="whyus-intro">
            IoTech combina tecnología IoT con un servicio técnico confiable y verificado. Desde la instalación hasta el mantenimiento, tienes control total.
          </p>

          <div className="whyus-reasons">
            {reasons.map(({ id, title, description, Icon }) => (
              <div className="whyus-reason" key={id}>
                <div className="whyus-reason-icon"><Icon /></div>
                <div className="whyus-reason-text">
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}