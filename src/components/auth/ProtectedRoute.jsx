import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Envuelve rutas que requieren autenticación.
 * Si el usuario no está logueado, redirige a /login
 * y guarda la ruta original para regresar después del login.
 *
 * Uso en App.jsx:
 *   <Route path="/checkout" element={
 *     <ProtectedRoute><CheckoutForm /></ProtectedRoute>
 *   } />
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return children
}