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
  <main className="min-h-screen bg-gray-900 text-white p-6">
    <h1 className="text-3xl font-bold mb-6">🛠️ Panel de Administración</h1>

    {error && <p className="text-red-500 mb-4">{error}</p>}

    {certificates.length === 0 ? (
      <p className="text-gray-400">No hay solicitudes de certificados.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-gray-800 p-4 rounded-xl shadow border border-gray-700 space-y-2">
            <p className="text-sm text-gray-400">
              <strong className="text-white">Usuario:</strong>{' '}
              {cert.user?.email || 'No disponible'}
            </p>
            <p className="text-sm text-gray-400">
              <strong className="text-white">Tipo:</strong>{' '}
              {cert.type}
            </p>
            <p className="text-sm text-gray-400">
              <strong className="text-white">Estado:</strong>{' '}
              <span className={`font-bold ${cert.status === 'PENDING' ? 'text-yellow-400' : cert.status === 'EMITTED' ? 'text-green-400' : 'text-red-400'}`}>
                {cert.status}
              </span>
            </p>

            {cert.status === 'PENDING' && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAction(cert.id, 'APPROVE')}
                  className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 text-sm"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => handleAction(cert.id, 'REJECT')}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Rechazar
                </button>
              </div>
            )}

            {cert.status === 'EMITTED' && (
              <a
                href={`http://localhost:3001/api/certificates/download/${cert.id}`}
                target="_blank"
                className="inline-block mt-3 text-blue-400 hover:underline text-sm"
              >
                Descargar PDF
              </a>
            )}
          </div>
        ))}
      </div>
    )}
  </main>
)

}

