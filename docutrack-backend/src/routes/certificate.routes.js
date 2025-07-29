const { verifyToken } = require('../middlewares/auth.middleware')
const { createCertificate, getUserCertificates } = require('../controllers/certificate.controller')
const { PrismaClient } = require('@prisma/client')

const express = require('express')
const upload = require('../utils/multer')
const path = require('path')
const fs = require('fs')
const prisma = new PrismaClient()

const router = express.Router()

// Ruta para crear certificado con archivo
router.post('/', verifyToken, upload.single('document'), createCertificate)

// Ruta para ver certificados del usuario
router.get('/', verifyToken, getUserCertificates)

// Descargar certificado PDF
router.get('/:id/download', verifyToken, async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id }
    })

    if (!certificate) {
      return res.status(404).json({ message: 'Certificado no encontrado' })
    }

    if (certificate.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes acceso a este certificado' })
    }

    if (certificate.status !== 'EMITTED') {
      return res.status(400).json({ message: 'El certificado aún no ha sido emitido' })
    }

    const filePath = path.join(__dirname, '../../certificados', certificate.pdfUrl)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado en el servidor' })
    }

    res.download(filePath, certificate.pdfUrl)
  } catch (error) {
    console.error('Error en descarga de certificado:', error)
    res.status(500).json({ message: 'Error al descargar certificado' })
  }
})


module.exports = router
