import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import bgImage from '../../assets/images/background.png'
import './Mapa.css'

/* ── Config colores por estado ── */
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
  map:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
}

export default function AdminMapa() {
  const { authHeaders } = useAuth()
  const mapRef     = useRef(null)   // referencia al div del mapa
  const leafletRef = useRef(null)   // instancia de Leaflet map
  const markersRef = useRef([])     // markers actuales

  const [solicitudes, setSolicitudes] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [leafletReady, setLeafletReady] = useState(false)

  /* ── Cargar Leaflet dinámicamente (sin npm install) ── */
  useEffect(() => {
    // Inyectar CSS de Leaflet si no está
    if (!document.getElementById('leaflet-css')) {
      const link  = document.createElement('link')
      link.id     = 'leaflet-css'
      link.rel    = 'stylesheet'
      link.href   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    // Cargar script de Leaflet
    if (window.L) { setLeafletReady(true); return }
    const script  = document.createElement('script')
    script.src    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => setLeafletReady(true)
    document.head.appendChild(script)
  }, [])

  /* ── Inicializar mapa cuando Leaflet esté listo ── */
  useEffect(() => {
    if (!leafletReady || !mapRef.current || leafletRef.current) return
    const L = window.L

    leafletRef.current = L.map(mapRef.current, {
      center: [19.4326, -99.1332], // CDMX
      zoom:   11,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(leafletRef.current)
  }, [leafletReady])

  /* ── Dibujar markers cuando cambien las solicitudes ── */
  useEffect(() => {
    if (!leafletReady || !leafletRef.current || !window.L) return
    const L = window.L

    // Limpiar markers anteriores
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const filtradas = filtroEstado
      ? solicitudes.filter(s => s.estado === filtroEstado)
      : solicitudes

    filtradas.forEach(s => {
      if (!s.latitud || !s.longitud) return
      const cfg   = ESTADO_CFG[s.estado] || { color: '#9CA3AF', label: s.estado }
      const icon  = L.divIcon({
        html: `<div style="
          width:14px;height:14px;border-radius:50%;
          background:${cfg.color};
          border:3px solid #fff;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })

      const marker = L.marker([s.latitud, s.longitud], { icon })
        .addTo(leafletRef.current)
        .bindPopup(`
          <div style="font-family:'DM Sans',sans-serif;min-width:180px;">
            <strong style="font-size:0.85rem;color:#0A0F1E;">${DISP_LABEL[s.dispositivo_tipo] || s.dispositivo_tipo}</strong>
            <br/>
            <span style="font-size:0.72rem;color:${cfg.color};font-weight:700;">${cfg.label}</span>
            <br/>
            <span style="font-size:0.72rem;color:#6B7280;">${s.colonia}, ${s.delegacion}</span>
          </div>
        `)

      markersRef.current.push(marker)
    })

    // Ajustar vista si hay markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current)
      leafletRef.current.fitBounds(group.getBounds().pad(0.15))
    }
  }, [solicitudes, filtroEstado, leafletReady])

  /* ── Cargar datos del backend ── */
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

  /* ── Estadísticas por estado ── */
  const stats = Object.entries(ESTADO_CFG).map(([estado, cfg]) => ({
    ...cfg,
    estado,
    count: solicitudes.filter(s => s.estado === estado).length,
  }))

  const totalVisible = filtroEstado
    ? solicitudes.filter(s => s.estado === filtroEstado).length
    : solicitudes.length

  return (
    <AdminLayout titulo="Mapa de Incidencias">

      {/* Hero */}
      <div className="mp-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="mp-hero-overlay" />
        <div className="mp-hero-body">
          <span className="mp-hero-eyebrow">Panel de administración · IoTech</span>
          <h1 className="mp-hero-title">Mapa de Incidencias</h1>
          <p className="mp-hero-sub">
            {loading ? '…' : `${solicitudes.length} solicitud${solicitudes.length !== 1 ? 'es' : ''} activa${solicitudes.length !== 1 ? 's' : ''} en el mapa`}
          </p>
        </div>
      </div>

      {/* Stats + filtros */}
      <div className="mp-controls">
        <div className="mp-stats">
          {stats.map(s => (
            <button
              key={s.estado}
              className={`mp-stat ${filtroEstado === s.estado ? 'active' : ''}`}
              onClick={() => setFiltroEstado(filtroEstado === s.estado ? '' : s.estado)}
              style={{ '--sc': s.color }}
            >
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

      {error && <div className="mp-error">{error}</div>}

      {/* Mapa + panel lateral */}
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
            {Ico.map} {totalVisible} marcador{totalVisible !== 1 ? 'es' : ''}
          </div>
        </div>

        {/* Panel lateral con lista */}
        <div className="mp-panel">
          <p className="mp-panel-title">
            {filtroEstado ? ESTADO_CFG[filtroEstado]?.label : 'Todas las incidencias'}
          </p>
          <div className="mp-list">
            {(filtroEstado
              ? solicitudes.filter(s => s.estado === filtroEstado)
              : solicitudes
            ).map(s => {
              const cfg = ESTADO_CFG[s.estado] || { color: '#9CA3AF', label: s.estado }
              return (
                <div key={s.id} className="mp-item">
                  <span className="mp-item-dot" style={{ background: cfg.color }} />
                  <div className="mp-item-info">
                    <span className="mp-item-tipo">{DISP_LABEL[s.dispositivo_tipo] || s.dispositivo_tipo}</span>
                    <span className="mp-item-loc">{Ico.map} {s.colonia}, {s.delegacion}</span>
                  </div>
                  <span className="mp-item-badge" style={{ color: cfg.color, background: `${cfg.color}15` }}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
            {solicitudes.length === 0 && !loading && (
              <p className="mp-empty">No hay incidencias activas con coordenadas.</p>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}