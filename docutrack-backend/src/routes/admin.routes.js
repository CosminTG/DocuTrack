const express = require('express')
const { verifyToken } = require('../middlewares/auth.middleware')
const { checkAdmin } = require('../middlewares/role.middleware')
const {
  getAllCertificates,
  getCertificateById,
  updateCertificateStatus,
  createUser,
} = require('../controllers/admin.controller')

const router = express.Router()

// Todas protegidas por token y rol ADMIN
router.use(verifyToken, checkAdmin)

router.get('/certificates', getAllCertificates)
router.get('/certificates/:id', getCertificateById)
router.patch('/certificates/:id', updateCertificateStatus)
router.post('/users', createUser)

module.exports = router
