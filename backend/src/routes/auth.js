const express = require('express')
const { registerValidators, loginValidators, refreshTokenValidator, handleValidationErrors } = require('../validators/authValidators')
const { authenticate } = require('../middlewares/auth')
const { register, login, refresh, me } = require('../controllers/authController')

const router = express.Router()

// Registro
router.post('/register', registerValidators, handleValidationErrors, register)

// Login
router.post('/login', loginValidators, handleValidationErrors, login)

// Refresh token
router.post('/refresh', refreshTokenValidator, handleValidationErrors, refresh)

// Obtener usuario actual
router.get('/me', authenticate, me)

module.exports = router
