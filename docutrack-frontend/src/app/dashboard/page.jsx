'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [certificates, setCertificates] = useState([])
  const [error, setError] = useState(null)
  const [type, setType] = useState('')
  const [file, setFile] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/certificates', {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg('')
    const token = localStorage.getItem('token')

    if (!file) {
      setError('Por favor selecciona un archivo PDF')
      return
    }

    const formData = new FormData()
    formData.append('type', type)
    formData.append('document', file)

    try {
      await axios.post('http://localhost:3001/api/certificates', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      setSuccessMsg('Certificado enviado correctamente')
      setType('')
      setFile(null)

      // Refrescar certificados
      const res = await axios.get('http://localhost:3001/api/certificates', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCertificates(res.data.certificates)
    } catch (err) {
      console.error(err)
      setError('Error al enviar la solicitud')
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-1000">Bienvenido al Dashboard</h1>

      <section className="bg-white shadow-md rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Solicitar nuevo certificado</h2>

        {successMsg && (
          <p className="mb-4 text-green-600 font-medium bg-green-50 p-3 rounded border border-green-300">
            {successMsg}
          </p>
        )}

        {error && (
          <p className="mb-4 text-red-600 font-medium bg-red-50 p-3 rounded border border-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="type" className="block mb-2 font-medium text-gray-600">
              Tipo de certificado
            </label>
            <input
              id="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Ejemplo: Certificado de estudios"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-600"
              required
            />
          </div>

          <div>
            <label htmlFor="file" className="block mb-2 font-medium text-gray-600">
              Archivo PDF
            </label>
            <input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
          >
            Enviar solicitud
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-1000">Mis Certificados</h2>

        {certificates.length === 0 ? (
          <p className="text-gray-500 italic">No has solicitado ningún certificado aún.</p>
        ) : (
          <ul className="space-y-5">
            {certificates.map((cert) => (
              <li
                key={cert.id}
                className="border rounded-lg shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="mb-3 sm:mb-0 ">
                  <p>
                    <strong >Tipo:</strong> {cert.type}
                  </p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <span
                      className={`font-semibold ${
                        cert.status === 'EMITTED'
                          ? 'text-green-600'
                          : cert.status === 'PENDING'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </p>
                </div>

                {cert.status === 'EMITTED' && (
                  <a
                    href={`http://localhost:3001/api/certificates/download/${cert.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Descargar PDF
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
