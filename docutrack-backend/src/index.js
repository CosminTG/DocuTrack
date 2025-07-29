const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { PrismaClient } = require('@prisma/client')

const authRoutes = require('./routes/auth.routes') // ← esto también cambiará a require
const certificateRoutes = require('./routes/certificate.routes')
//admin
const adminRoutes = require('./routes/admin.routes')

dotenv.config()

const app = express()
const prisma = new PrismaClient()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/certificates', certificateRoutes)
//ruta admin
app.use('/api/admin', adminRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`)
})



