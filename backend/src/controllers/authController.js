const bcrypt = require('bcrypt')
const { User } = require('../models')
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../middlewares/auth')

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ status: 'error', message: 'El email ya está registrado' })
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      is_active: true,
    })

    // Generar tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuario
    const user = await User.findOne({ where: { email } })
    if (!user || !user.is_active) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' })
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' })
    }

    // Generar tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.json({
      status: 'success',
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken)

    // Buscar usuario
    const user = await User.findByPk(decoded.id)
    if (!user || !user.is_active) {
      return res.status(401).json({ status: 'error', message: 'Usuario no válido' })
    }

    // Generar nuevo access token
    const newAccessToken = generateAccessToken(user)

    res.json({
      status: 'success',
      message: 'Token renovado',
      data: {
        accessToken: newAccessToken,
      },
    })
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Refresh token inválido' })
  }
}

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    })

    res.json({
      status: 'success',
      data: { user },
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = {
  register,
  login,
  refresh,
  me,
}
