import './InfoSection.css'

const QrIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h2v2h-2zM18 14h3M14 18h1M17 18h3M20 21v-3" />
  </svg>
)

// Técnico: persona con llave inglesa
const TechnicianIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-2a5 5 0 0 1 5-5h4" />
    <path d="M16 21l5-5-1.5-1.5-1 1-3-3 1-1-1.5-1.5L10 16l3 3-1 1 1.5 1.5 1-1L16 21z" />
  </svg>
)

// Solicitud en línea: pantalla con check / formulario
const OnlineRequestIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <path d="M8 20h8M12 18v2" />
    <polyline points="7 11 10 14 17 8" />
  </svg>
)

const infoCards = [
  {
    id: 1,
    Icon: QrIcon,
    label: 'VALIDACIÓN SEGURA',
    description: 'Verifica a tu técnico con código QR',
    variant: 'light',
  },
  {
    id: 2,
    Icon: TechnicianIcon,
    label: 'TÉCNICOS CERTIFICADOS',
    description: 'Equipo especializado en CDMX',
    variant: 'dark',
  },
  {
    id: 3,
    Icon: OnlineRequestIcon,
    label: 'SOLICITUDES EN LÍNEA',
    description: 'Registra tu servicio desde la app',
    variant: 'accent',
  },
]

export default function InfoSection() {
  return (
    <section className="info-section">
      <div className="info-container">
        {infoCards.map(({ id, Icon, label, description, variant }) => (
          <div className={`info-card-item info-card-item--${variant}`} key={id}>
            <div className="info-card-icon">
              <Icon />
            </div>
            <div className="info-card-text">
              <span className="info-card-label">{label}</span>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}