const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso denegado: Solo administradores' })
  }

  next()
}

module.exports = { checkAdmin }
