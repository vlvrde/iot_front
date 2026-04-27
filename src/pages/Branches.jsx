import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import './Branches.css'

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.29 6.29l1.46-1.46a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const MapIcon = ({ size = 28 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
)

const branches = [
  {
    id: 1,
    name: 'IoTech CDMX — ESCOM IPN',
    address: 'Av. Juan de Dios Bátiz, Nueva Industrial Vallejo, Gustavo A. Madero, 07320 Ciudad de México, CDMX',
    phone: '55 1932-1225',
    hours: [
      'Lunes a Viernes: 09:00 a 19:00 hrs.',
      'Sábados: 10:00 a 16:00 hrs.',
    ],
    contacts: [
      { name: 'Soporte Técnico',  ext: 'Ext. 101', email: 'soporte@iotech.mx' },
      { name: 'Ventas',           ext: 'Ext. 102', email: 'ventas@iotech.mx' },
      { name: 'Instalaciones',    ext: 'Ext. 103', email: 'instalaciones@iotech.mx' },
    ],
    // Coordenadas ESCOM IPN
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.523!2d-99.1480!3d19.4978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f8b6e2a7b3e5%3A0x1234567890abcdef!2sESCOM%20IPN!5e0!3m2!1ses!2smx!4v1234567890',
  },
]

export default function Branches() {
  return (
    <>
      <Navbar />

      {/* ── Hero blanco con ícono circular ── */}
      <div className="br-hero">
        <div className="br-hero-icon">
          <MapIcon size={28} />
        </div>
        <h1>Sucursales</h1>
        <p>Encuéntranos en Ciudad de México. Atención presencial y soporte técnico certificado.</p>
      </div>

      {/* ── Contenido ── */}
      <div className="br-page">
        <div className="br-container">
          {branches.map(branch => (
            <div className="br-card" key={branch.id}>

              {/* Nombre y dirección */}
              <div className="br-card-header">
                <h2>{branch.name}</h2>
                <div className="br-address">
                  <MapPinIcon />
                  <span>{branch.address}</span>
                </div>
              </div>

              {/* Contacto + Horario */}
              <div className="br-info-grid">

                <div className="br-contact">
                  <h3>Contacto</h3>

                  <table className="br-contacts-table">
                    <tbody>
                      {branch.contacts.map((c, i) => (
                        <tr key={i}>
                          <td className="br-contact-name">{c.name}</td>
                          <td className="br-contact-ext">{c.ext}</td>
                          <td>
                            <a href={`mailto:${c.email}`} className="br-email">
                              <MailIcon />
                              {c.email}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="br-hours">
                  <h3>
                    <ClockIcon />
                    Horario de Atención
                  </h3>
                  {branch.hours.map((h, i) => (
                    <p key={i}>{h}</p>
                  ))}
                </div>

              </div>

              {/* Mapa */}
              <div className="br-map">
                <iframe
                  title={branch.name}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.5234567890123!2d-99.14800000000001!3d19.497800000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f892e4abd6bd%3A0x7d911e7a9e7a6d7b!2sESCOM%20IPN!5e0!3m2!1ses-419!2smx!4v1700000000000!5m2!1ses-419!2smx"
                  width="100%"
                  height="380"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}