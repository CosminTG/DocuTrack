// 'use client'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'

// export default function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [role, setRole] = useState('')
//   const [email, setEmail] = useState('')
//   const router = useRouter()

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     const roleStored = localStorage.getItem('role')

//     if (token) {
//       setIsLoggedIn(true)
//       setRole(roleStored)

//       // Obtener email del token por si se quiere mostrar para algo
//       const payload = JSON.parse(atob(token.split('.')[1]))
//       setEmail(payload.email)
//     }
//   }, [])

//   const goTo = (path) => {
//     router.push(path)
//   }

//   return (
//     <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow">
//       <div className="font-bold text-lg cursor-pointer" onClick={() => goTo('/')}>
//         DocuTrack 📄
//       </div>

//       <div className="flex gap-4 items-center">
//   {isLoggedIn && (
//     <>
//       {role === 'ADMIN' ? (
//         <button onClick={() => goTo('/admin')}>Panel Admin</button>
//       ) : (
//         <button onClick={() => goTo('/dashboard')}>Dashboard</button>
//       )}
//       <span className="text-sm text-gray-300 hidden sm:inline">({email})</span>
//       <button
//         onClick={() => {
//           localStorage.clear()
//           router.push('/login')
//         }}
//         className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
//       >
//         Cerrar sesión
//       </button>
//     </>
//   )}
// </div>

//     </nav>
//   )
// }
'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🧠 Usuario desde contexto:', user)
  }, [user])

  const goTo = (path) => {
    router.push(path)
  }

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="font-bold text-lg cursor-pointer">
        DocuTrack 📄
      </div>

      {user && (
        <div className="flex gap-4 items-center">
          {user.role === 'ADMIN' ? (
            <>
              <span className="text-sm text-gray-300 hidden sm:inline">Correo: {user.email}</span>
              <button onClick={() => goTo('/admin')}className="ml-4 px-3 py-1 bg-green-600 hover:bg-red-700 rounded text-white text-sm">Panel Admin</button>
              <button onClick={() => goTo('/admin/users')}className="ml-4 px-3 py-1 bg-green-600 hover:bg-red-700 rounded text-white text-sm">Crear Usuario</button> {/* 👈 nuevo botón */}
            </>
          ) : (
            <>
            <span className="text-sm text-gray-300 hidden sm:inline">Correo: {user.email}</span>
            {/* <button onClick={() => goTo('/dashboard')}>Panel Usuario</button> */}
            </>
          )}
          <button
            onClick={() => {
              logout()
              router.push('/login')
            }}
            className="ml-4 px-3 py-1 bg-blue-600 hover:bg-red-700 rounded text-white text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  )
}
