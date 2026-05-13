require('dotenv').config()

const required = [
  'DB_NAME',
  'DB_USER',
  'DB_HOST',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'TELEGRAM_BOT_TOKEN',
]

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[Config] Variable de entorno requerida: ${key}`)
    process.exit(1)
  }
})

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 10,
  },
}
