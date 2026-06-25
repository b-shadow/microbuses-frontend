import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'

import { loginAdmin } from '../../modules/auth/services/module.service'
import { setAuthToken } from '../services/api'

type AuthState = {
  token: string | null
  role: string | null
}

type AuthContextType = AuthState & {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const initialToken = localStorage.getItem('sig_admin_token')
const initialRole = localStorage.getItem('sig_admin_role')

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(initialToken)
  const [role, setRole] = useState<string | null>(initialRole)

  const value = useMemo<AuthContextType>(() => ({
    token,
    role,
    isAuthenticated: Boolean(token),
    login: async (email: string, password: string) => {
      const res = await loginAdmin(email, password)
      if (!res.success || !res.data?.access_token) {
        return { ok: false, message: res.message || 'No se pudo iniciar sesion' }
      }
      setToken(res.data.access_token)
      setRole(res.data.role)
      setAuthToken(res.data.access_token)
      localStorage.setItem('sig_admin_role', res.data.role)
      return { ok: true, message: res.message }
    },
    logout: () => {
      setToken(null)
      setRole(null)
      setAuthToken(null)
      localStorage.removeItem('sig_admin_role')
    },
  }), [role, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}