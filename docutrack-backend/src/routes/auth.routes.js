const express = require('express')
const { register, login } = require('../controllers/auth.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', verifyToken, (req, res) => {
  res.json({
    message: 'Ruta protegida',
    user: req.user
  })
})
module.exports = router
