import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(!!getToken())

  useEffect(() => {
    if (!getToken()) return
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  const handleAuth = ({ token, user }) => {
    setToken(token)
    setUser(user)
  }

  const value = {
    user,
    loading,
    login: async (email, password) => handleAuth(await api('/auth/login', { method: 'POST', body: { email, password } })),
    register: async (name, email, password) =>
      handleAuth(await api('/auth/register', { method: 'POST', body: { name, email, password } })),
    logout: () => {
      setToken(null)
      setUser(null)
    },
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
