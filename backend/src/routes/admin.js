const express = require('express')
const { body, validationResult } = require('express-validator')
const { sendMessage } = require('../services/telegramService')
// const { authenticate, requireRole } = require('../middlewares/auth') // Asumiendo que existen

const router = express.Router()

// Middleware de autenticación y rol admin
// router.use(authenticate)
// router.use(requireRole('admin'))

// Enviar mensaje a Telegram
router.post('/send-telegram', [
  body('chatId').isString().notEmpty().withMessage('chatId es requerido'),
  body('message').isString().notEmpty().withMessage('message es requerido'),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() })
  }

  const { chatId, message } = req.body

  try {
    await sendMessage(chatId, message)
    return res.json({ status: 'success', message: 'Mensaje enviado a Telegram' })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Error enviando mensaje' })
  }
})

module.exports = router