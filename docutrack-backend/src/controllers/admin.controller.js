const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

const getAllCertificates = async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        user: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ certificates })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener certificados' })
  }
}

const getCertificateById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        user: {
          select: { email: true }
        }
      }
    })

    if (!certificate) {
      return res.status(404).json({ message: 'Certificado no encontrado' })
    }

    res.json({ certificate })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar certificado' })
  }
}

const { generateCertificatePdf } = require('../utils/pdfGenerator')

const updateCertificateStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body

    const allowedStatuses = ['VALIDATING', 'EMITTED', 'REJECTED', 'CORRECTION_REQUESTED']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado no permitido' })
    }

    // Obtener el certificado + user
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!certificate) {
      return res.status(404).json({ message: 'Certificado no encontrado' })
    }

    let pdfFileName = certificate.pdfUrl

    if (status === 'EMITTED') {
      // Generar PDF si se aprueba
      pdfFileName = await generateCertificatePdf(certificate, certificate.user)
    }

    // Actualizar estado y pdf
    const updated = await prisma.certificate.update({
      where: { id },
      data: {
        status,
        pdfUrl: pdfFileName
      }
    })

    res.json({ message: `Estado actualizado a ${status}`, certificate: updated })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar estado' })
  }
}

async function createUser(req, res) {
  const { email, password, role } = req.body

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role === 'ADMIN' ? 'ADMIN' : 'USER'
      }
    })

    res.json({ message: 'Usuario creado', user: { id: user.id, email: user.email, role: user.role } })
  } catch (err) {
    console.error('Error al crear usuario desde admin:', err)
    res.status(500).json({ message: 'Error al crear usuario' })
  }
}

module.exports = {
  getAllCertificates,
  getCertificateById,
  updateCertificateStatus,
  createUser
}
