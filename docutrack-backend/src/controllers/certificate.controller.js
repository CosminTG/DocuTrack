const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const createCertificate = async (req, res) => {
  try {
    const userId = req.user.id
    const file = req.file

    if (!file) {
      return res.status(400).json({ message: 'Se requiere un archivo PDF o imagen.' })
    }

    const newCertificate = await prisma.certificate.create({
      data: {
        userId,
        status: 'RECEIVED',
        pdfUrl: file.filename // solo guardamos el nombre, no ruta completa
      }
    })

    res.status(201).json({
      message: 'Solicitud de certificado enviada con archivo.',
      certificateId: newCertificate.id
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al crear certificado.' })
  }
}

const getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.id

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ certificates })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener certificados' })
  }
}

module.exports = {
  createCertificate,
  getUserCertificates
}