'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function AdminUsersPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'ADMIN') router.push('/login')
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('http://localhost:3001/api/admin/users',
        { email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(`✅ ${res.data.message}`)
      setEmail('')
      setPassword('')
      setRole('USER')
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Error'}`)
    }
  }

  return (
    <div className="text-white max-w-md mx-auto mt-10 p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Crear nuevo usuario</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="email" placeholder="Email" className="p-2 rounded bg-gray-700" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" className="p-2 rounded bg-gray-700" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select className="p-2 rounded bg-gray-700" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded py-2">Crear usuario</button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}
