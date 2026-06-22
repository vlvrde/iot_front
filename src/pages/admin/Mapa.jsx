import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import bgImage from '../../assets/images/background.png'
import './Mapa.css'

const ESTADO_CFG = {
  pendiente:  { color: '#F59E0B', label: 'Pendiente'  },
  asignado:   { color: '#6366f1', label: 'Asignado'   },
  en_proceso: { color: '#8B5CF6', label: 'En proceso' },
}

const DISP_LABEL = {
  sensor_gas:       'Sensor Gas',
  sensor_agua:      'Sensor Agua',
  sistema_apertura: 'Apertura',
}

const Ico = {
  refresh: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.47"/></svg>,
  map:     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  nocoord: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
}

export default function AdminMapa() {
  const { authHeaders } = useAuth()
  const mapRef      = useRef(null)
  const leafletRef  = useRef(null)
  const markersRef  = useRef([])

  const [solicitudes,   setSolicitudes]   = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [filtroEstado,  setFiltroEstado]  = useState('')
  const [leafletReady,  setLeafletReady]  = useState(false)
  const [selectedId,    setSelectedId]    = useState(null)

  // ── Cargar Leaflet vía CDN ────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id    = 'leaflet-css'
      link.rel   = 'stylesheet'
      link.href  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    if (window.L) { setLeafletReady(true); return }
    const script    = document.createElement('script')
    script.src      = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload   = () => setLeafletReady(true)
    script.onerror  = () => setError('No se pudo cargar la librería del mapa.')
    document.head.appendChild(script)
  }, [])

  // ── Inicializar mapa ──────────────────────────────────────────
  useEffect(() => {
    if (!leafletReady || !mapRef.current || leafletRef.current) return
    const L = window.L
    leafletRef.current = L.map(mapRef.current, {
      center: [19.4326, -99.1332],
      zoom: 11,
      zoomControl: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(leafletRef.current)
  }, [leafletReady])

  // ── Dibujar markers ───────────────────────────────────────────
  useEffect(() => {
    if (!leafletReady || !leafletRef.current || !window.L) return
    const L = window.L

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const filtradas = filtroEstado
      ? solicitudes.filter(s => s.estado === filtroEstado)
      : solicitudes

    // Solo markers para solicitudes con coordenadas
    const conCoords = filtradas.filter(s => s.latitud && s.longitud)

    conCoords.forEach(s => {
      const cfg  = ESTADO_CFG[s.estado] || { color: '#9CA3AF', label: s.estado }
      const icon = L.divIcon({
        html: `<div style="
          width:16px;height:16px;border-radius:50%;
          background:${cfg.color};
          border:3px solid #fff;
          box-shadow:0 2px 10px rgba(0,0,0,0.35);
          transition:transform 0.15s;
        "></div>`,
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const marker = L.marker([s.latitud, s.longitud], { icon })
        .addTo(leafletRef.current)
        .bindPopup(`
          <div style="font-family:'DM Sans',sans-serif;min-width:200px;padding:4px 0;">
            <div style="font-size:0.85rem;font-weight:700;color:#0A0F1E;margin-bottom:4px;">
              ${DISP_LABEL[s.dispositivo_tipo] || s.dispositivo_tipo}
            </div>
            <div style="display:inline-block;padding:2px 8px;border-radius:99px;
              font-size:0.68rem;font-weight:700;margin-bottom:6px;
              color:${cfg.color};background:${cfg.color}18;">
              ${cfg.label}
            </div>
            <div style="font-size:0.72rem;color:#6B7280;">
              📍 ${s.colonia}, ${s.delegacion}
            </div>
          </div>
        `, { maxWidth: 240 })
        .on('click', () => setSelectedId(s.id))

      markersRef.current.push(marker)
    })

    // Ajustar zoom a los markers si hay alguno
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current)
      leafletRef.current.fitBounds(group.getBounds().pad(0.2))
    }
  }, [solicitudes, filtroEstado, leafletReady])

  // ── Cargar datos ──────────────────────────────────────────────
  const cargarSolicitudes = () => {
    const API = import.meta.env.VITE_API_URL
    setLoading(true); setError('')
    fetch(`${API}/admin/solicitudes/mapa`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setSolicitudes(data.solicitudes || []))
      .catch(() => setError('No se pudieron cargar las incidencias.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargarSolicitudes() }, [])

  // ── Stats ─────────────────────────────────────────────────────
  const filtradas   = filtroEstado ? solicitudes.filter(s => s.estado === filtroEstado) : solicitudes
  const conCoords   = filtradas.filter(s => s.latitud && s.longitud).length
  const sinCoords   = filtradas.filter(s => !s.latitud || !s.longitud).length

  const stats = Object.entries(ESTADO_CFG).map(([estado, cfg]) => ({
    ...cfg, estado,
    count: solicitudes.filter(s => s.estado === estado).length,
  }))

  return (
    <AdminLayout titulo="Mapa de Incidencias">

      {/* Hero */}
      <div className="mp-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="mp-hero-overlay" />
        <div className="mp-hero-body">
          <span className="mp-hero-eyebrow">Panel de administración · IoTech</span>
          <h1 className="mp-hero-title">Mapa de Incidencias</h1>
          <p className="mp-hero-sub">
            {loading ? '…' : `${solicitudes.length} solicitud${solicitudes.length !== 1 ? 'es' : ''} activa${solicitudes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mp-controls">
        <div className="mp-stats">
          {stats.map(s => (
            <button key={s.estado}
              className={`mp-stat ${filtroEstado === s.estado ? 'active' : ''}`}
              onClick={() => setFiltroEstado(filtroEstado === s.estado ? '' : s.estado)}
              style={{ '--sc': s.color }}>
              <span className="mp-stat-dot" style={{ background: s.color }} />
              <span className="mp-stat-label">{s.label}</span>
              <strong className="mp-stat-val" style={{ color: s.color }}>{s.count}</strong>
            </button>
          ))}
          {filtroEstado && (
            <button className="mp-clear" onClick={() => setFiltroEstado('')}>
              Todos ({solicitudes.length})
            </button>
          )}
        </div>
        <button className="mp-refresh" onClick={cargarSolicitudes} disabled={loading}>
          {Ico.refresh} {loading ? 'Actualizando…' : 'Actualizar'}
        </button>
      </div>

      {/* Aviso sin coordenadas */}
      {sinCoords > 0 && (
        <div className="mp-notice">
          {Ico.nocoord}
          <span><strong>{sinCoords}</strong> solicitud{sinCoords !== 1 ? 'es' : ''} sin coordenadas — se muestran en el panel pero no en el mapa.
          Las nuevas solicitudes se geocodifican automáticamente al crearse.</span>
        </div>
      )}

      {error && <div className="mp-error">{error}</div>}

      {/* Layout mapa + panel */}
      <div className="mp-layout">

        {/* Mapa */}
        <div className="mp-map-wrap">
          <div ref={mapRef} className="mp-map" />
          {!leafletReady && (
            <div className="mp-map-loading">
              <div className="mp-spinner" />
              <p>Cargando mapa…</p>
            </div>
          )}
          <div className="mp-map-badge">
            {Ico.map} {conCoords} en mapa
          </div>
        </div>

        {/* Panel lateral */}
        <div className="mp-panel">
          <div className="mp-panel-header">
            <p className="mp-panel-title">
              {filtroEstado ? ESTADO_CFG[filtroEstado]?.label : 'Todas'}
            </p>
            <span className="mp-panel-count">{filtradas.length}</span>
          </div>

          <div className="mp-list">
            {filtradas.length === 0 && !loading && (
              <p className="mp-empty">Sin solicitudes activas.</p>
            )}
            {filtradas.map(s => {
              const cfg      = ESTADO_CFG[s.estado] || { color: '#9CA3AF', label: s.estado }
              const tieneCoords = !!(s.latitud && s.longitud)
              return (
                <div key={s.id}
                  className={`mp-item ${selectedId === s.id ? 'mp-item--selected' : ''}`}
                  onClick={() => {
                    setSelectedId(s.id)
                    // Si tiene coords, centrar el mapa en ese marker
                    if (tieneCoords && leafletRef.current) {
                      leafletRef.current.setView([s.latitud, s.longitud], 15)
                    }
                  }}>
                  <span className="mp-item-dot" style={{ background: cfg.color }} />
                  <div className="mp-item-info">
                    <span className="mp-item-tipo">
                      {DISP_LABEL[s.dispositivo_tipo] || s.dispositivo_tipo}
                    </span>
                    <span className="mp-item-loc">
                      {tieneCoords ? Ico.map : Ico.nocoord}
                      {s.colonia}, {s.delegacion}
                    </span>
                  </div>
                  <span className="mp-item-badge"
                    style={{ color: cfg.color, background: `${cfg.color}15` }}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}