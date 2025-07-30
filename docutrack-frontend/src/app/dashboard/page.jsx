'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [certificates, setCertificates] = useState([])
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'ADMIN') {
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

  const [type, setType] = useState('')
const [file, setFile] = useState(null)
const [successMsg, setSuccessMsg] = useState('')

const handleSubmit = async (e) => {
  e.preventDefault()
  const token = localStorage.getItem('token')

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
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold">Bienvenido al Dashboard</h1>
        <form
  onSubmit={handleSubmit}
  className="bg-white p-4 mb-6 shadow rounded space-y-4"
>
  <h2 className="text-xl font-semibold">Solicitar nuevo certificado</h2>

  {successMsg && <p className="text-green-600">{successMsg}</p>}

  <div>
    <label className="block font-medium">Tipo de certificado</label>
    <input
      type="text"
      value={type}
      onChange={(e) => setType(e.target.value)}
      className="w-full border px-4 py-2 rounded mt-1"
      required
    />
  </div>

  <div>
    <label className="block font-medium">Archivo PDF</label>
    <input
      type="file"
      accept="application/pdf"
      onChange={(e) => setFile(e.target.files[0])}
      className="w-full mt-1"
      required
    />
  </div>

  <button
    type="submit"
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Enviar solicitud
  </button>
</form>

      <h1 className="text-2xl font-bold mb-4">Mis Certificados</h1>

      {error && <p className="text-red-500">{error}</p>}

      {certificates.length === 0 ? (
        <p className="text-gray-500">No has solicitado ningún certificado aún.</p>
      ) : (
        <ul className="space-y-4">
          {certificates.map((cert) => (
            <li key={cert.id} className="border p-4 rounded shadow">
              <p><strong>Tipo:</strong> {cert.type}</p>
              <p><strong>Estado:</strong> {cert.status}</p>
              {cert.status === 'EMITTED' && (
                <a
                  href={`http://localhost:3001/api/certificates/download/${cert.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mt-2 inline-block"
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
