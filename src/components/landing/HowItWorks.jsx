import './HowItWorks.css'

const steps = [
  {
    id: 1,
    number: '01',
    title: 'Solicita tu servicio',
    description: 'Regístrate en la plataforma y crea una solicitud de instalación, mantenimiento, reparación o desinstalación de tu dispositivo IoT.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 20h8M12 18v2" />
        <polyline points="7 11 10 14 17 8" />
      </svg>
    ),
  },
  {
    id: 2,
    number: '02',
    title: 'Te asignamos un técnico',
    description: 'Nuestro sistema asigna al técnico certificado más cercano a tu zona. Recibirás su nombre, foto y horario de visita.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-2a5 5 0 0 1 5-5h4" />
        <path d="M16 21l5-5-1.5-1.5-1 1-3-3 1-1-1.5-1.5L10 16l3 3-1 1 1.5 1.5 1-1L16 21z" />
      </svg>
    ),
  },
  {
    id: 3,
    number: '03',
    title: 'Valida con código QR',
    description: 'Antes de comenzar el servicio, escanea el código QR del técnico desde la app para confirmar su identidad de forma segura.',
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
    id: 4,
    number: '04',
    title: 'Servicio completado',
    description: 'El técnico realiza el trabajo y tú confirmas la finalización. Queda un registro del servicio y puedes calificar la atención recibida.',
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="hiw" id="como-funciona">
      <div className="hiw-container">

        <div className="hiw-header">
          <span className="hiw-eyebrow">PROCESO SIMPLE</span>
          <h2>¿Cómo <span className="hiw-accent">funciona</span>?</h2>
          <p>Del registro a la confirmación del servicio, todo desde la plataforma.</p>
        </div>

        <div className="hiw-steps">
          {steps.map(({ id, number, title, description, Icon }, idx) => (
            <div className="hiw-step" key={id}>
              {/* Línea conectora (no aparece en el último) */}
              {idx < steps.length - 1 && <div className="hiw-connector" />}

              <div className="hiw-step-icon">
                <Icon />
              </div>

              <div className="hiw-step-body">
                <span className="hiw-step-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}