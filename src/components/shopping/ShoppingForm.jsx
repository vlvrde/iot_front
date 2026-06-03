import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../landing/Navbar'
import Footer from '../landing/Footer'
import { useAuth } from '../../context/AuthContext'
import './ShoppingForm.css'
import fireImg  from '../../assets/images/fire.png'
import waterImg from '../../assets/images/water.png'
import iotImg   from '../../assets/images/system.png'
import { ESTADO_CDMX, SelectAlcaldia } from '../../constants/cdmx'


const products = [
  {
    id: 'fff796ab-4b54-11f1-9d4a-0a0027000003',
    name: 'Sensor de Gas',
    description: 'Detección inteligente de fugas de gas en tu hogar.',
    price: 1299,
    image: fireImg,
    theme: 'red',
    features: ['Detección ultrasensible', 'Alertas instantáneas', 'Compatible con Alexa'],
  },
  {
    id: 'fff83820-4b54-11f1-9d4a-0a0027000003',
    name: 'Sensor de Agua',
    description: 'Monitorea el consumo y detecta fugas automáticamente.',
    price: 899,
    image: waterImg,
    theme: 'blue',
    features: ['Monitoreo en tiempo real', 'Prevención de fugas', 'Reporte de consumo'],
  },
  {
    id: 'fff83a46-4b54-11f1-9d4a-0a0027000003',
    name: 'Sistema de Apertura de Zaguán',
    description: 'Control remoto seguro de tu zaguán desde cualquier lugar.',
    price: 2499,
    image: iotImg,
    theme: 'black',
    features: ['Control remoto', 'Activación por voz', 'Registro de accesos'],
  },
]

/* ── Íconos ── */
const CartIcon    = ({ size = 18 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
const TrashIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const LockIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const WrenchIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
const QrIcon      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h2v2h-2zM18 14h3M14 18h1M17 18h3M20 21v-3"/></svg>
const ArrowIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
const CheckIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg>
const CloseIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const SuccessIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="60" height="60"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></svg>
const CardIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const TransferIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M5 12h14M12 5l7 7-7 7"/></svg>

const guarantees = [
  { Icon: LockIcon,   text: 'Pago seguro' },
  { Icon: WrenchIcon, text: 'Instalación incluida' },
  { Icon: QrIcon,     text: 'Técnico verificado QR' },
]

// ══════════════════════════════════════════════════════════════
// MODAL DE CHECKOUT
// ══════════════════════════════════════════════════════════════
function CheckoutModal({ cart, total, tax, subtotal, onClose, authHeaders }) {
  const navigate    = useNavigate()
  const [step, setStep]         = useState('form')   // 'form' | 'success'
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [compraId, setCompraId] = useState(null)

  const [form, setForm] = useState({
    nombre:        '',
    telefono:      '',
    metodo_pago:   'tarjeta',
    calle:         '',
    num_exterior:  '',
    num_interior:  '',
    codigo_postal: '',
    colonia:       '',
    delegacion:    '',
    estado_dir:   ESTADO_CDMX,
  })

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const { nombre, telefono, calle, num_exterior, codigo_postal, colonia, delegacion } = form
    if (!nombre || !telefono || !calle || !num_exterior || !codigo_postal || !colonia || !delegacion) {
      setError('Por favor completa todos los campos obligatorios (*).')
      return
    }

    setLoading(true)
    try {
      const API   = import.meta.env.VITE_API_URL
      const items = cart.map(i => ({ dispositivo_id: i.id, cantidad: i.quantity }))

      const res  = await fetch(`${API}/compras`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ items, ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al procesar la compra.')

      setCompraId(data.compra_id)
      setStep('success')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="co-backdrop" onClick={e => step === 'form' && e.target === e.currentTarget && onClose()}>
      <div className="co-modal">

        {/* Header */}
        <div className="co-header">
          <div className="co-header-left">
            {step === 'form' && <div className="co-header-icon"><CartIcon size={22} /></div>}
            <h2>{step === 'success' ? '¡Compra exitosa!' : 'Finalizar compra'}</h2>
          </div>
          {step === 'form' && (
            <button className="co-close" onClick={onClose} aria-label="Cerrar"><CloseIcon /></button>
          )}
        </div>

        {/* ── Formulario ── */}
        {step === 'form' && (
          <div className="co-body">

            {/* Columna izquierda: resumen */}
            <div className="co-left">
              <h3 className="co-section-title">Resumen del pedido</h3>
              <div className="co-items">
                {cart.map(item => (
                  <div className="co-item" key={item.id}>
                    <div className="co-item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="co-item-info">
                      <span className="co-item-name">{item.name}</span>
                      <span className="co-item-qty">Cantidad: {item.quantity}</span>
                    </div>
                    <span className="co-item-price">
                      ${(item.price * item.quantity).toLocaleString('es-MX')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="co-totales">
                <div className="co-total-row"><span>Subtotal</span><span>${subtotal.toLocaleString('es-MX')}</span></div>
                <div className="co-total-row"><span>IVA (16%)</span><span>${tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                <div className="co-total-row co-total-final">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="co-nota">
                <CheckIcon />
                Se generará una solicitud de instalación automáticamente por cada producto.
              </div>
            </div>

            {/* Columna derecha: formulario */}
            <form className="co-right" onSubmit={handleSubmit}>
              {error && <div className="co-error">{error}</div>}

              <h3 className="co-section-title">Datos de contacto</h3>
              <div className="co-fields-grid">
                <div className="co-field co-field--full">
                  <label>Nombre completo *</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan García López" />
                </div>
                <div className="co-field">
                  <label>Teléfono *</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="55 1234 5678" />
                </div>
              </div>

              <h3 className="co-section-title">Dirección de instalación</h3>
              <div className="co-fields-grid">
                <div className="co-field co-field--full">
                  <label>Calle *</label>
                  <input name="calle" value={form.calle} onChange={handleChange} placeholder="Av. Insurgentes Sur" />
                </div>
                <div className="co-field">
                  <label>Núm. exterior *</label>
                  <input name="num_exterior" value={form.num_exterior} onChange={handleChange} placeholder="100" />
                </div>
                <div className="co-field">
                  <label>Núm. interior</label>
                  <input name="num_interior" value={form.num_interior} onChange={handleChange} placeholder="Depto 3B" />
                </div>
                <div className="co-field">
                  <label>Código postal *</label>
                  <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} placeholder="07320" maxLength={5} />
                </div>
                <div className="co-field">
                  <label>Colonia *</label>
                  <input name="colonia" value={form.colonia} onChange={handleChange} placeholder="Industrial Vallejo" />
                </div>
                <div className="co-field co-field--full">
                  <label>Alcaldía *</label>
                  <SelectAlcaldia
                    name="delegacion"
                    value={form.delegacion}
                    onChange={handleChange}
                    className="co-select"
                  />
                </div>
              </div>

              <h3 className="co-section-title">Método de pago</h3>
              <div className="co-metodos">
                <label className={`co-metodo ${form.metodo_pago === 'tarjeta' ? 'active' : ''}`}>
                  <input type="radio" name="metodo_pago" value="tarjeta" checked={form.metodo_pago === 'tarjeta'} onChange={handleChange} />
                  <CardIcon />
                  <span>Tarjeta</span>
                </label>
                <label className={`co-metodo ${form.metodo_pago === 'transferencia' ? 'active' : ''}`}>
                  <input type="radio" name="metodo_pago" value="transferencia" checked={form.metodo_pago === 'transferencia'} onChange={handleChange} />
                  <TransferIcon />
                  <span>Transferencia</span>
                </label>
              </div>

              <button type="submit" className="co-btn-pagar" disabled={loading}>
                {loading
                  ? <span className="co-spinner" />
                  : <>Confirmar compra — ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</>
                }
              </button>
            </form>
          </div>
        )}

        {/* ── Éxito ── */}
        {step === 'success' && (
          <div className="co-success">
            <div className="co-success-icon"><SuccessIcon /></div>
            <h3>¡Tu pedido fue confirmado!</h3>
            <p>
              Se {cart.length === 1 ? 'ha generado' : 'han generado'} <strong>{cart.length} solicitud{cart.length !== 1 ? 'es' : ''} de instalación</strong> automáticamente.
              Nuestro equipo te contactará para agendar la visita técnica.
            </p>
            <div className="co-success-folio">
              Folio: <strong>#{compraId?.substring(0, 8).toUpperCase()}</strong>
            </div>
            <button className="co-btn-dashboard" onClick={() => navigate('/cliente/dashboard')}>
              Ir a mi Dashboard
              <ArrowIcon />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function ShoppingForm() {
  const [cart, setCart]           = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const { isAuthenticated, authHeaders } = useAuth()
  const navigate = useNavigate()

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      return existing
        ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart  = (id)       => setCart(prev => prev.filter(i => i.id !== id))
  const updateQuantity  = (id, qty)  => {
    if (qty <= 0) removeFromCart(id)
    else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const handleCheckout = () => {
    if (isAuthenticated) {
      setModalOpen(true)
    } else {
      navigate('/login', { state: { from: '/carrito' } })
    }
  }

  const isInCart  = (id) => cart.some(i => i.id === id)
  const subtotal  = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const tax       = subtotal * 0.16
  const total     = subtotal + tax
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      <Navbar />

      <div className="shop-hero">
        <div className="shop-hero-icon"><CartIcon size={28} /></div>
        <h1>Catálogo de Productos</h1>
        <p>Instalación certificada incluida. Técnicos verificados en toda la CDMX.</p>
      </div>

      <div className="shop-page">
        <div className="shop-layout">

          {/* Productos */}
          <main className="shop-products">
            <p className="shop-subtitle">{products.length} productos disponibles</p>
            <div className="shop-grid">
              {products.map(product => (
                <div className={`shop-card shop-card--${product.theme}`} key={product.id}>
                  <div className="shop-card-img">
                    <img src={product.image} alt={product.name} />
                    {isInCart(product.id) && (
                      <div className="shop-card-in-cart"><CheckIcon /> En carrito</div>
                    )}
                  </div>
                  <div className="shop-card-body">
                    <h3>{product.name}</h3>
                    <p className="shop-card-desc">{product.description}</p>
                    <ul className="shop-card-features">
                      {product.features.map((f, i) => (
                        <li key={i}><span className="shop-dot" />{f}</li>
                      ))}
                    </ul>
                    <div className="shop-card-footer">
                      <div className="shop-price">
                        <span className="shop-price-label">Precio</span>
                        <span className="shop-price-value">${product.price.toLocaleString('es-MX')}</span>
                        <span className="shop-price-tax">+ IVA</span>
                      </div>
                      <button className="shop-btn-add" onClick={() => addToCart(product)}>
                        <CartIcon size={16} />
                        {isInCart(product.id) ? 'Agregar otro' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* Carrito */}
          <aside className="shop-cart">
            <div className="shop-cart-inner">
              <div className="shop-cart-header">
                <div className="shop-cart-title">
                  <CartIcon size={18} />
                  <h3>Carrito</h3>
                </div>
                {cartCount > 0 && <span className="shop-cart-badge">{cartCount}</span>}
              </div>

              {cart.length === 0 ? (
                <div className="shop-cart-empty">
                  <CartIcon size={44} />
                  <p>Tu carrito está vacío</p>
                  <span>Agrega productos desde el catálogo</span>
                </div>
              ) : (
                <>
                  <div className="shop-cart-items">
                    {cart.map(item => (
                      <div className="shop-cart-item" key={item.id}>
                        <div className="shop-cart-item-img">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="shop-cart-item-info">
                          <h4>{item.name}</h4>
                          <p>${item.price.toLocaleString('es-MX')} c/u</p>
                          <div className="shop-qty">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                        <div className="shop-cart-item-right">
                          <span className="shop-item-total">${(item.price * item.quantity).toLocaleString('es-MX')}</span>
                          <button className="shop-remove" onClick={() => removeFromCart(item.id)}><TrashIcon /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="shop-summary">
                    <div className="shop-summary-row"><span>Subtotal</span><span>${subtotal.toLocaleString('es-MX')}</span></div>
                    <div className="shop-summary-row"><span>IVA (16%)</span><span>${tax.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    <div className="shop-summary-row shop-summary-total"><span>Total</span><span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                  </div>

                  <button className="shop-checkout-btn" onClick={handleCheckout}>
                    {isAuthenticated ? 'Proceder al pago' : 'Iniciar sesión para pagar'}
                    <ArrowIcon />
                  </button>
                  <button className="shop-clear-btn" onClick={() => setCart([])}>Vaciar carrito</button>
                </>
              )}

              <div className="shop-guarantees">
                {guarantees.map(({ Icon, text }, i) => (
                  <div className="shop-guarantee" key={i}>
                    <div className="shop-guarantee-icon"><Icon /></div>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>

      <Footer />

      {modalOpen && (
        <CheckoutModal
          cart={cart}
          total={total}
          tax={tax}
          subtotal={subtotal}
          onClose={() => setModalOpen(false)}
          authHeaders={authHeaders}
        />
      )}
    </>
  )
}