import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import ClienteLayout from '../../components/cliente/ClienteLayout'
import { Html5Qrcode } from 'html5-qrcode'
import bgImage from '../../assets/images/background.png'
import './ValidarQR.css'

/* ── Íconos ── */
const QrIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <path d="M14 14h2v2h-2zM18 14h3M14 18h1M17 18h3M20 21v-3"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const ErrorIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
)
const ScanIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
  </svg>
)
const StopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
  </svg>
)
const RetryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.47"/>
  </svg>
)
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const QR_READER_ID = 'qr-reader-element'

export default function ValidarQR() {
  const { authHeaders } = useAuth()

  const [estado,    setEstado]    = useState('idle')
  const [resultado, setResultado] = useState(null)
  const [errorMsg,  setErrorMsg]  = useState('')
  const qrRef = useRef(null)

  // ── Iniciar escáner DESPUÉS de que React haya pintado el div ──
  // El div#qr-reader-element solo existe en el DOM cuando estado==='scanning'
  // Por eso arrancamos el escáner en un useEffect, no en el click handler
  useEffect(() => {
    if (estado !== 'scanning') return

    let cancelled = false

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(QR_READER_ID)
        qrRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            if (cancelled) return
            // QR detectado — detener y validar
            await html5QrCode.stop().catch(() => {})
            qrRef.current = null
            if (!cancelled) await validarQR(decodedText)
          },
          () => {} // errores de frame a frame — ignorar
        )
      } catch (err) {
        if (!cancelled) {
          setEstado('error')
          setErrorMsg(
            err?.message?.includes('permission')
              ? 'Permiso de cámara denegado. Verifica los permisos del navegador.'
              : 'No se pudo acceder a la cámara: ' + (err?.message || 'error desconocido')
          )
        }
      }
    }

    startScanner()

    // Cleanup: si el componente se desmonta o el estado cambia, detener cámara
    return () => {
      cancelled = true
      if (qrRef.current) {
        qrRef.current.stop().catch(() => {})
        qrRef.current = null
      }
    }
  }, [estado]) // se dispara cuando estado pasa a 'scanning'

  // ── Handlers ─────────────────────────────────────────────────
  // Solo cambia el estado — el useEffect se encarga de arrancar la cámara
  const iniciarEscaneo = () => {
    setResultado(null)
    setErrorMsg('')
    setEstado('scanning')  // ← React pinta el div, luego useEffect arranca la cámara
  }

  const detenerEscaneo = async () => {
    if (qrRef.current) {
      await qrRef.current.stop().catch(() => {})
      qrRef.current = null
    }
    setEstado('idle')
  }

  const validarQR = async (token) => {
    setEstado('loading')
    try {
      const API = import.meta.env.VITE_API_URL
      const res = await fetch(`${API}/qr/validar`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ token }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'QR inválido.')
      setResultado(data)
      setEstado('success')
    } catch (err) {
      setErrorMsg(err.message)
      setEstado('error')
    }
  }

  const reiniciar = () => {
    setEstado('idle')
    setResultado(null)
    setErrorMsg('')
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <ClienteLayout titulo="Validar QR del Técnico">

      <div className="qr-page">

        {/* Instrucciones */}
        <div className="qr-info-card">
          <div className="qr-info-icon"><QrIcon /></div>
          <div className="qr-info-text">
            <h3>¿Cómo funciona?</h3>
            <p>
              Antes de permitir el acceso al técnico, escanea el código QR que
              él generó desde la plataforma. El sistema verificará su identidad
              en tiempo real. El código es válido por 30 minutos y de un solo uso.
            </p>
          </div>
        </div>

        {/* Área del escáner */}
        <div className="qr-scanner-area">

          {/* idle */}
          {estado === 'idle' && (
            <div className="qr-idle">
              <div className="qr-idle-icon"><ScanIcon /></div>
              <p>Presiona el botón para activar la cámara y escanear el QR del técnico.</p>
              <button className="qr-btn-start" onClick={iniciarEscaneo}>
                <ScanIcon /> Iniciar escaneo
              </button>
            </div>
          )}

          {/* scanning — el div del lector DEBE existir en el DOM antes de que
              Html5Qrcode lo inicialice, por eso está aquí y no condicionado */}
          {estado === 'scanning' && (
            <div className="qr-scanning">
              <div className="qr-viewfinder">
                {/* Este div es montado por React ANTES de que useEffect arranque la cámara */}
                <div id={QR_READER_ID} className="qr-reader" />
                <div className="qr-corner qr-corner--tl" />
                <div className="qr-corner qr-corner--tr" />
                <div className="qr-corner qr-corner--bl" />
                <div className="qr-corner qr-corner--br" />
                <div className="qr-scan-line" />
              </div>
              <p className="qr-scanning-hint">Apunta la cámara al código QR del técnico</p>
              <button className="qr-btn-stop" onClick={detenerEscaneo}>
                <StopIcon /> Cancelar
              </button>
            </div>
          )}

          {/* loading */}
          {estado === 'loading' && (
            <div className="qr-loading">
              <div className="qr-spinner" />
              <p>Verificando identidad del técnico…</p>
            </div>
          )}

          {/* success */}
          {estado === 'success' && resultado && (
            <div className="qr-result qr-result--ok">
              <div className="qr-result-icon qr-result-icon--ok">
                <CheckIcon />
              </div>
              <h3>¡Técnico verificado!</h3>
              <p>La identidad del técnico ha sido confirmada exitosamente.</p>

              <div className="qr-tecnico-card">
                <div className="qr-tecnico-avatar">
                  {resultado.tecnico?.foto
                    ? <img src={resultado.tecnico.foto} alt="Técnico" />
                    : <UserIcon />
                  }
                </div>
                <div className="qr-tecnico-info">
                  <strong>{resultado.tecnico?.nombre} {resultado.tecnico?.paterno}</strong>
                  <span>Técnico certificado IoTech</span>
                  {resultado.solicitud_id && (
                    <span className="qr-folio">
                      Folio: #{resultado.solicitud_id.substring(0, 8).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <button className="qr-btn-retry" onClick={reiniciar}>
                <RetryIcon /> Escanear otro QR
              </button>
            </div>
          )}

          {/* error */}
          {estado === 'error' && (
            <div className="qr-result qr-result--error">
              <div className="qr-result-icon qr-result-icon--error">
                <ErrorIcon />
              </div>
              <h3>Verificación fallida</h3>
              <p>{errorMsg}</p>
              <button className="qr-btn-retry" onClick={reiniciar}>
                <RetryIcon /> Intentar de nuevo
              </button>
            </div>
          )}

        </div>
      </div>
    </ClienteLayout>
  )
}