const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const register = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' })
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe.' })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER' 
      }
    })

    res.status(201).json({ message: 'Usuario registrado con éxito.', userId: newUser.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error del servidor.' })
  }
}

const jwt = require('jsonwebtoken')
const { generateToken } = require('../utils/jwt')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    console.log('EMAIL:', email)
    console.log('PASSWORD:', password)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' })
    }
    console.log('Usuario encontrado:', user)

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' })
    }
    console.log('Comparando:', password, 'vs', user.password)
    
    const token = generateToken(user)

    res.json({ message: 'Login exitoso', token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error del servidor.' })
  }
}

module.exports = {
  register,
  login
}

//module.exports = { register }
