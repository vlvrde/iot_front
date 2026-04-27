import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

import Landing          from './pages/Landing'
import Login            from './pages/Login'
import Register         from './pages/Register'
import Shopping         from './pages/Shopping'
import Catalog          from './pages/Catalog'
import CatalogWater     from './pages/CatalogWater'
import SystemOpeningPage from './pages/SystemOpening'
import Branches from './pages/Branches'
// import CheckoutForm  from './pages/CheckoutForm'  ← descomenta cuando lo crees

function App() {
  return (
    // AuthProvider envuelve TODO para que cualquier componente
    // pueda acceder al estado de autenticación con useAuth()
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                          element={<Landing />} />
          <Route path="/servicios"                 element={<Landing />} />
          <Route path="/dispositivos"              element={<Landing />} />
          <Route path="/contacto"                  element={<Landing />} />
          <Route path="/facturacion"               element={<Landing />} />
          <Route path="/carrito"                   element={<Shopping />} />
          <Route path="/sucursales"                element={<Branches />} />
          <Route path="/login"                     element={<Login />} />
          <Route path="/register"                  element={<Register />} />
          <Route path="/catalogo/sensor-gas"       element={<Catalog />} />
          <Route path="/catalogo/sensor-agua"      element={<CatalogWater />} />
          <Route path="/catalogo/apertura-zaguan"  element={<SystemOpeningPage />} />

          {/* Ruta protegida — solo accesible si el usuario está logueado.
              Si no, ProtectedRoute lo redirige a /login automáticamente. */}
          {/* <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutForm />
            </ProtectedRoute>
          } /> */}

          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App