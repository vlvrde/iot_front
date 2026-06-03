import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  if (loading) return null

  // Lee localStorage directamente como fuente de verdad
  // para cubrir el frame donde el estado de React aún no propagó
  const storedUser  = localStorage.getItem('user')
  const storedToken = localStorage.getItem('token')
  const localUser   = storedUser ? JSON.parse(storedUser) : null

  const autenticado = isAuthenticated || (!!localUser && !!storedToken)
  const rolActual   = user?.rol || localUser?.rol

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  if (roles && !roles.includes(rolActual)) {
    return <Navigate to="/" replace />
  }

  return children
}