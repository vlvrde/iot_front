import { Link } from 'react-router-dom'
import './Services.css'
import fireImg from '../../assets/images/fire.png'
import waterImg from '../../assets/images/water.png'
import iotImg from '../../assets/images/system.png'

const products = [
  {
    id: 1,
    name: 'Sensor de Gas',
    description: 'Detección inteligente de fugas de gas en tu hogar. Alertas en tiempo real y notificaciones directas a tu smartphone.',
    image: fireImg,
    features: ['Detección ultrasensible', 'Alertas instantáneas', 'Compatible con Alexa'],
    route: '/catalogo/sensor-gas',
    theme: 'red',
  },
  {
    id: 2,
    name: 'Sensor de Agua',
    description: 'Monitorea el consumo de agua y detecta fugas automáticamente. Control total de tu sistema hidráulico.',
    image: waterImg,
    features: ['Monitoreo en tiempo real', 'Prevención de fugas', 'Reporte de consumo'],
    route: '/catalogo/sensor-agua',
    theme: 'blue',
  },
  {
    id: 3,
    name: 'Sistema de Apertura de Zaguán',
    description: 'Abre tu zaguán de forma segura y remota. Integración con Alexa para control por voz.',
    image: iotImg,
    features: ['Control remoto', 'Activación por voz', 'Registro de accesos'],
    route: '/catalogo/apertura-zaguan',
    theme: 'black',
  },
]

export default function Services() {
  return (
    <section className="services" id="servicios">
      <div className="services-container">
        <div className="services-header">
          <h2>Utiliza tu propia <span className="services-accent">Alexa</span></h2>
          <p>Productos disponibles para tu hogar inteligente</p>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <div className={`product-card product-card--${product.theme}`} key={product.id}>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-content">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <ul className="product-features">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="checkmark">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="product-actions">
                  <Link to={product.route} className="product-detail-btn">
                    Ver producto
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón global inferior */}
        <div className="services-footer">
          <Link to="/carrito" className="services-catalog-btn">
            Adquirir Productos
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}