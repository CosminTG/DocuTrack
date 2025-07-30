const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso denegado: Solo para admins' })
  }
  next()
}

module.exports = { checkAdmin }
