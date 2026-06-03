import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL

export function AuthProvider({ children }) {

  // ── Inicialización SÍNCRONA desde localStorage ───────────────
  // No useEffect — el estado ya tiene el valor correcto en el
  // primer render, eliminando la ventana donde loading=false y user=null
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const [token, setToken] = useState(() =>
    localStorage.getItem('token') || null
  )

  // loading ya no necesita ser true porque no hay useEffect asíncrono
  const [loading] = useState(false)

  // ── LOGIN ────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión.')

    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(data.usuario))
    setToken(data.token)
    setUser(data.usuario)

    return data.usuario
  }

  // ── REGISTER ─────────────────────────────────────────────────
  const register = async (formData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(formData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al registrarse.')

    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(data.usuario))
    setToken(data.token)
    setUser(data.usuario)

    return data.usuario
  }

  // ── LOGOUT ───────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }

  // ── HELPER para fetch autenticado ────────────────────────────
  const authHeaders = () => ({
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${token}`,
  })

  const isAuthenticated = !!user && !!token

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout,
      authHeaders, isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}