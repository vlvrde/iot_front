import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute   from './components/auth/ProtectedRoute'

import Landing           from './pages/Landing'
import Login             from './pages/Login'
import Register          from './pages/Register'
import Shopping          from './pages/Shopping'
import Catalog           from './pages/Catalog'
import CatalogWater      from './pages/CatalogWater'
import SystemOpeningPage from './pages/SystemOpening'
import Branches          from './pages/Branches'

// Cliente
import ClienteDashboard from './pages/cliente/Dashboard'
import MisDispositivos  from './pages/cliente/MisDispositivos'
import Solicitudes      from './pages/cliente/Solicitudes'
import Historial        from './pages/cliente/Historial'
import ValidarQR        from './pages/cliente/ValidarQR'

// Técnico
import Citas       from './pages/tecnico/Citas'
import DetalleCita from './pages/tecnico/DetalleCita'
import Configuracion from './pages/tecnico/Configuracion'


// Admin
import AdminDashboard  from './pages/admin/Dashboard'
import AdminSolicitudes from './pages/admin/Solicitudes_admin'
import AdminMapa       from './pages/admin/Mapa'
import AdminTecnicos   from './pages/admin/Tecnicos'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Públicas ─────────────────────────────────────── */}
          <Route path="/"                         element={<Landing />} />
          <Route path="/servicios"                element={<Landing />} />
          <Route path="/dispositivos"             element={<Landing />} />
          <Route path="/contacto"                 element={<Landing />} />
          <Route path="/facturacion"              element={<Landing />} />
          <Route path="/sucursales"               element={<Branches />} />
          <Route path="/login"                    element={<Login />} />
          <Route path="/register"                 element={<Register />} />
          <Route path="/carrito"                  element={<Shopping />} />
          <Route path="/catalogo/sensor-gas"      element={<Catalog />} />
          <Route path="/catalogo/sensor-agua"     element={<CatalogWater />} />
          <Route path="/catalogo/apertura-zaguan" element={<SystemOpeningPage />} />
          <Route path="/tecnico/configuracion" element={<Configuracion />} />


          {/* ── Cliente ──────────────────────────────────────── */}
          <Route path="/cliente/dashboard" element={
            <ProtectedRoute roles={['cliente']}>
              <ClienteDashboard />
            </ProtectedRoute>
          } />
          <Route path="/cliente/dispositivos" element={
            <ProtectedRoute roles={['cliente']}>
              <MisDispositivos />
            </ProtectedRoute>
          } />
          <Route path="/cliente/solicitudes" element={
            <ProtectedRoute roles={['cliente']}>
              <Solicitudes />
            </ProtectedRoute>
          } />
          <Route path="/cliente/historial" element={
            <ProtectedRoute roles={['cliente']}>
              <Historial />
            </ProtectedRoute>
          } />
          <Route path="/cliente/validar-qr" element={
            <ProtectedRoute roles={['cliente']}>
              <ValidarQR />
            </ProtectedRoute>
          } />

          {/* ── Técnico ──────────────────────────────────────── */}
          <Route path="/tecnico/citas" element={
            <ProtectedRoute roles={['tecnico']}>
              <Citas />
            </ProtectedRoute>
          } />
          <Route path="/tecnico/citas/:id" element={
            <ProtectedRoute roles={['tecnico']}>
              <DetalleCita />
            </ProtectedRoute>
          } />

          {/* ── Admin ────────────────────────────────────────── */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['administrador']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/solicitudes" element={
            <ProtectedRoute roles={['administrador']}>
              <AdminSolicitudes />
            </ProtectedRoute>
          } />
          <Route path="/admin/mapa" element={
            <ProtectedRoute roles={['administrador']}>
              <AdminMapa />
            </ProtectedRoute>
          } />
          <Route path="/admin/tecnicos" element={
            <ProtectedRoute roles={['administrador']}>
              <AdminTecnicos />
            </ProtectedRoute>
          } />

          {/* ── Fallback — SIEMPRE AL FINAL ──────────────────── */}
          <Route path="*" element={<Landing />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App