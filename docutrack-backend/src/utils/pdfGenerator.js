const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const generateCertificatePdf = async (certificate, user) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const fileName = `certificado-${certificate.id}.pdf`
    const filePath = path.join(__dirname, '../../certificados', fileName)

    // Asegúrate de que exista la carpeta
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
    }

    const stream = fs.createWriteStream(filePath)
    doc.pipe(stream)

    doc.fontSize(20).text('Certificado Oficial', { align: 'center' })
    doc.moveDown()
    doc.fontSize(14).text(`Emitido para: ${user.email}`)
    doc.text(`ID de solicitud: ${certificate.id}`)
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`)
    doc.text(`Estado: ${certificate.status}`)

    doc.end()

    stream.on('finish', () => {
      resolve(fileName)
    })

    stream.on('error', (err) => {
      reject(err)
    })
  })
}

module.exports = { generateCertificatePdf }
