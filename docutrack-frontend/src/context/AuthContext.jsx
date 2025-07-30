'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    const role = localStorage.getItem('role')

    if (token && email && role) {
      setUser({ email, role })
    }
  }, [])

  const login = (email, role, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('email', email)
    localStorage.setItem('role', role)
    setUser({ email, role })
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
