'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      })

      const { token } = res.data

      // Guardar token en localStorage
      //localStorage.setItem('token', token)
      localStorage.setItem('token', res.data.token)
      
      // Decodificar payload (parte intermedia del JWT)
      const payload = JSON.parse(atob(res.data.token.split('.')[1]))

      localStorage.setItem('role', payload.role)
      // Redirigir según rol
      //router.push('/dashboard')
      if (payload.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error(err)
      setError('Credenciales inválidas')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
      </form>
    </main>
  )
}
