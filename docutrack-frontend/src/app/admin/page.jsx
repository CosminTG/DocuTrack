'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [certificates, setCertificates] = useState([])
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    //if (!token) {
      //router.push('/login')
      //return
    //}
    if (!token || role !== 'ADMIN') {
      router.push('/login')
      return
    }
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/admin/certificates', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setCertificates(res.data.certificates)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los certificados')
      }
    }

    fetchData()
  }, [router])

  const handleAction = async (id, action) => {
    const token = localStorage.getItem('token')

    try {
      await axios.patch(
        `http://localhost:3001/api/admin/certificates/${id}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Refrescar después de aprobar/rechazar
      const res = await axios.get('http://localhost:3001/api/admin/certificates', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCertificates(res.data.certificates)
    } catch (err) {
      console.error('Error al realizar acción', err)
    }
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Panel de administración</h1>

      {error && <p className="text-red-500">{error}</p>}

      {certificates.length === 0 ? (
        <p>No hay solicitudes de certificados.</p>
      ) : (
        <ul className="space-y-4">
          {certificates.map((cert) => (
            <li
              key={cert.id}
              className="border p-4 rounded shadow space-y-2"
            >
              <p><strong>Usuario:</strong> {cert.user.email}</p>
              <p><strong>Tipo:</strong> {cert.type}</p>
              <p><strong>Estado:</strong> {cert.status}</p>

              {cert.status === 'PENDING' && (
                <div className="space-x-2">
                  <button
                    onClick={() => handleAction(cert.id, 'APPROVE')}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleAction(cert.id, 'REJECT')}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Rechazar
                  </button>
                </div>
              )}

              {cert.status === 'EMITTED' && (
                <a
                  href={`http://localhost:3001/api/certificates/download/${cert.id}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Descargar PDF
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
