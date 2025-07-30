// 'use client'
// import { useState } from 'react'
// import axios from 'axios'
// import { useRouter } from 'next/navigation'

// export default function LoginPage() {
//   const router = useRouter()

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState(null)

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     try {
//       const res = await axios.post('http://localhost:3001/api/auth/login', {
//         email,
//         password
//       })

//       const { token } = res.data

//       // Guardar token en localStorage
//       //localStorage.setItem('token', token)
//       localStorage.setItem('token', res.data.token)
      
//       // Decodificar payload (parte intermedia del JWT)
//       const payload = JSON.parse(atob(res.data.token.split('.')[1]))

//       localStorage.setItem('role', payload.role)
//       // Redirigir según rol
//       //router.push('/dashboard')
//       if (payload.role === 'ADMIN') {
//         router.push('/admin')
//       } else {
//         router.push('/dashboard')
//       }
//     } catch (err) {
//       console.error(err)
//       setError('Credenciales inválidas')
//     }
//   }

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded shadow-md w-full max-w-md"
//       >
//         <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <input
//           type="email"
//           placeholder="Correo"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full px-4 py-2 mb-4 border rounded"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Contraseña"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full px-4 py-2 mb-6 border rounded"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           Iniciar sesión
//         </button>
//       </form>
//     </main>
//   )
// }
'use client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext' // asegúrate que funcione el alias

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

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
      const payload = JSON.parse(atob(token.split('.')[1]))

      login(payload.email, payload.role, token)

      if (payload.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }

      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Credenciales inválidas')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-lg w-full max-w-md animate-fade-in"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Bienvenido a DocuTrack</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
  <input
    type="email"
    placeholder="ejemplo@correo.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    required
  />
</div>

<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
  <input
    type="password"
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    required
  />
</div>


        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
        >
          Iniciar sesión
        </button>
      </form>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}


