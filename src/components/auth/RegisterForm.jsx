import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bgImage from '../../assets/images/background.png'
import './RegisterForm.css'

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: '',
    calle: '',
    numInterior: '',
    numExterior: '',
    codigoPostal: '',
    colonia: '',
    delegacion: '',
    estado: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    // Aquí conectas con tu backend
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="login-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="login-overlay" />

      <div className="register-card">

        <button
          type="button"
          className="login-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Regresar"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Ícono de usuario */}
        <div className="register-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        <h1>Crear Cuenta</h1>
        <p className="login-subtitle">Completa tus datos:</p>

        <form className="register-form" onSubmit={handleSubmit}>

          {/* Nombre y Apellidos */}
          <div className="form-row">
            <div className="login-field">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Juan"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="apellidoPaterno">Apellido Paterno *</label>
              <input
                id="apellidoPaterno"
                name="apellidoPaterno"
                type="text"
                placeholder="García"
                value={form.apellidoPaterno}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="apellidoMaterno">Apellido Materno *</label>
              <input
                id="apellidoMaterno"
                name="apellidoMaterno"
                type="text"
                placeholder="López"
                value={form.apellidoMaterno}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Correo y Teléfono */}
          <div className="form-row">
            <div className="login-field">
              <label htmlFor="correo">Correo Electrónico *</label>
              <input
                id="correo"
                name="correo"
                type="email"
                placeholder="usuario@dominio.com"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="5512345678"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="form-row-full">
            <h3 className="form-section-title">Domicilio</h3>
          </div>

          <div className="form-row">
            <div className="login-field">
              <label htmlFor="calle">Calle *</label>
              <input
                id="calle"
                name="calle"
                type="text"
                placeholder="Avenida Principal"
                value={form.calle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="numExterior">Número Exterior *</label>
              <input
                id="numExterior"
                name="numExterior"
                type="text"
                placeholder="123"
                value={form.numExterior}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="numInterior">Número Interior</label>
              <input
                id="numInterior"
                name="numInterior"
                type="text"
                placeholder="A"
                value={form.numInterior}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="login-field">
              <label htmlFor="codigoPostal">Código Postal *</label>
              <input
                id="codigoPostal"
                name="codigoPostal"
                type="text"
                placeholder="28001"
                value={form.codigoPostal}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="colonia">Colonia *</label>
              <input
                id="colonia"
                name="colonia"
                type="text"
                placeholder="Centro"
                value={form.colonia}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="login-field">
              <label htmlFor="delegacion">Delegación/Municipio *</label>
              <input
                id="delegacion"
                name="delegacion"
                type="text"
                placeholder="Cuauhtémoc"
                value={form.delegacion}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="estado">Estado *</label>
              <input
                id="estado"
                name="estado"
                type="text"
                placeholder="Ciudad de México"
                value={form.estado}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="form-row-full">
            <h3 className="form-section-title">Seguridad</h3>
          </div>

          <div className="form-row">
            <div className="login-field">
              <label htmlFor="password">Contraseña *</label>
              <div className="login-password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label="Mostrar contraseña"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <div className="login-password-wrap">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowConfirmPassword(s => !s)}
                  aria-label="Mostrar contraseña"
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="login-links">
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="login-spinner" /> : 'Registrarse'}
          </button>

        </form>

      </div>
    </div>
  )
}