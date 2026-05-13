const { nodeEnv } = require('../config/env')

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || err.status || 500
  const message = err.message || 'Error interno del servidor'

  const response = { status: 'error', message }

  if (nodeEnv === 'development') {
    response.stack = err.stack
  }

  console.error(`[Error ${statusCode}]`, message)

  return res.status(statusCode).json(response)
}

module.exports = errorHandler
