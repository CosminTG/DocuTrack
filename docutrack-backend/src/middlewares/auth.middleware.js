const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1] // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Token inválido' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Guarda los datos del token para usarlos en la ruta
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' })
  }
}

module.exports = { verifyToken }
