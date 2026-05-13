const jwt = require('jsonwebtoken')
const { jwt: jwtConfig } = require('../config/env')
const { secret: jwtSecret, expiresIn: jwtExpiresIn, refreshSecret: jwtRefreshSecret, refreshExpiresIn: jwtRefreshExpiresIn } = jwtConfig

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Token no proporcionado' })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ status: 'error', message: 'Token expirado', code: 'TOKEN_EXPIRED' })
    }
    return res.status(401).json({ status: 'error', message: 'Token inválido' })
  }
}

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'No autenticado' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Permiso insuficiente' })
    }

    next()
  }
}

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  )
}

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    jwtRefreshSecret,
    { expiresIn: jwtRefreshExpiresIn }
  )
}

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtRefreshSecret)
  } catch (error) {
    throw new Error('Refresh token inválido')
  }
}

module.exports = {
  authenticate,
  requireRole,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
}
