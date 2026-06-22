import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import TecnicoLayout from '../../components/tecnico/TecnicoLayout'
import './Configuracion.css'

const API = import.meta.env.VITE_API_URL

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)
const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const UserIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

export default function Configuracion() {
  const { authHeaders } = useAuth()
  const fileRef = useRef(null)

  const [perfil,       setPerfil]       = useState(null)
  const [preview,      setPreview]      = useState(null)
  const [fotoFile,     setFotoFile]     = useState(null)
  const [loadingFoto,  setLoadingFoto]  = useState(false)
  const [msgFoto,      setMsgFoto]      = useState({ text: '', ok: true })

  const [passForm,     setPassForm]     = useState({ password_actual: '', password_nueva: '', password_confirm: '' })
  const [loadingPass,  setLoadingPass]  = useState(false)
  const [msgPass,      setMsgPass]      = useState({ text: '', ok: true })

  // Cargar perfil
  useEffect(() => {
    fetch(`${API}/tecnico/perfil`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.perfil) {
          setPerfil(data.perfil)
          const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '')
          if (data.perfil.foto) setPreview(`${BASE_URL}${data.perfil.foto}`)
        }
      })
      .catch(() => {})
  }, [])

  // Previsualizar foto seleccionada
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFotoFile(file)
    setPreview(URL.createObjectURL(file))
    setMsgFoto({ text: '', ok: true })
  }

  // Subir foto
  const handleSubirFoto = async () => {
    if (!fotoFile) return
    setLoadingFoto(true)
    setMsgFoto({ text: '', ok: true })
    try {
      const fd = new FormData()
      fd.append('foto', fotoFile)
      const headers = authHeaders()
      delete headers['Content-Type'] // dejar que FormData ponga el boundary
      const res  = await fetch(`${API}/tecnico/perfil/foto`, { method: 'PUT', headers, body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '')
      setPreview(`${BASE_URL}${data.foto}`)
      setMsgFoto({ text: 'Foto actualizada correctamente.', ok: true })
      setFotoFile(null)
    } catch (err) {
      setMsgFoto({ text: err.message, ok: false })
    } finally {
      setLoadingFoto(false)
    }
  }

  // Cambiar contraseña
  const handlePassSubmit = async (e) => {
    e.preventDefault()
    setMsgPass({ text: '', ok: true })
    if (passForm.password_nueva !== passForm.password_confirm) {
      return setMsgPass({ text: 'Las contraseñas nuevas no coinciden.', ok: false })
    }
    setLoadingPass(true)
    try {
      const res  = await fetch(`${API}/tecnico/perfil/password`, {
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify({
          password_actual: passForm.password_actual,
          password_nueva:  passForm.password_nueva,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setMsgPass({ text: data.message, ok: true })
      setPassForm({ password_actual: '', password_nueva: '', password_confirm: '' })
    } catch (err) {
      setMsgPass({ text: err.message, ok: false })
    } finally {
      setLoadingPass(false)
    }
  }

  return (
    <TecnicoLayout>
      <div className="cfg-page">

        {/* Hero */}
        <div className="cfg-hero">
          <span className="cfg-eyebrow">Panel Técnico · IoTech</span>
          <h1>Configuración</h1>
          <p>Personaliza tu perfil y mantén tu cuenta segura.</p>
        </div>

        <div className="cfg-grid">

          {/* ── Foto de perfil ── */}
          <section className="cfg-card">
            <div className="cfg-card-icon cfg-card-icon--blue"><CameraIcon /></div>
            <h2 className="cfg-card-title">Foto de identificación</h2>
            <p className="cfg-card-sub">
              Esta foto aparece en tu perfil y en el código QR que presentas al cliente.
            </p>

            <div className="cfg-avatar-wrap">
              <div className="cfg-avatar">
                {preview
                  ? <img src={preview} alt="Foto de perfil" />
                  : <div className="cfg-avatar-placeholder"><UserIcon /></div>
                }
                <button className="cfg-avatar-btn" onClick={() => fileRef.current?.click()}>
                  <CameraIcon />
                </button>
              </div>
              {perfil && (
                <div className="cfg-avatar-info">
                  <strong>{perfil.nombre} {perfil.paterno}</strong>
                  <span>{perfil.email}</span>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {fotoFile && (
              <p className="cfg-file-name">📎 {fotoFile.name}</p>
            )}

            {msgFoto.text && (
              <div className={`cfg-msg ${msgFoto.ok ? 'cfg-msg--ok' : 'cfg-msg--err'}`}>
                {msgFoto.ok && <CheckIcon />} {msgFoto.text}
              </div>
            )}

            <button
              className="cfg-btn cfg-btn--primary"
              onClick={handleSubirFoto}
              disabled={!fotoFile || loadingFoto}
            >
              {loadingFoto ? <span className="cfg-spinner" /> : <CameraIcon />}
              {loadingFoto ? 'Subiendo…' : 'Guardar foto'}
            </button>
          </section>

          {/* ── Cambiar contraseña ── */}
          <section className="cfg-card">
            <div className="cfg-card-icon cfg-card-icon--indigo"><LockIcon /></div>
            <h2 className="cfg-card-title">Cambiar contraseña</h2>
            <p className="cfg-card-sub">
              Usa una contraseña única y difícil de adivinar.
            </p>

            <form className="cfg-form" onSubmit={handlePassSubmit}>
              <div className="cfg-field">
                <label>Contraseña actual</label>
                <input
                  type="password"
                  value={passForm.password_actual}
                  onChange={e => setPassForm(p => ({ ...p, password_actual: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="cfg-field">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  value={passForm.password_nueva}
                  onChange={e => setPassForm(p => ({ ...p, password_nueva: e.target.value }))}
                  placeholder="Mín. 8 caracteres"
                  required
                  minLength={8}
                />
              </div>
              <div className="cfg-field">
                <label>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={passForm.password_confirm}
                  onChange={e => setPassForm(p => ({ ...p, password_confirm: e.target.value }))}
                  placeholder="Repite la contraseña"
                  required
                />
              </div>

              {msgPass.text && (
                <div className={`cfg-msg ${msgPass.ok ? 'cfg-msg--ok' : 'cfg-msg--err'}`}>
                  {msgPass.ok && <CheckIcon />} {msgPass.text}
                </div>
              )}

              <button type="submit" className="cfg-btn cfg-btn--primary" disabled={loadingPass}>
                {loadingPass ? <span className="cfg-spinner" /> : <LockIcon />}
                {loadingPass ? 'Guardando…' : 'Actualizar contraseña'}
              </button>
            </form>
          </section>

        </div>
      </div>
    </TecnicoLayout>
  )
}