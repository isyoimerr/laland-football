const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const { cors: corsConfig, rateLimit: rlConfig, nodeEnv } = require('./config/env')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

// ─── Seguridad ─────────────────────────────────────────────────────────────────
app.use(helmet())

const corsOrigin = nodeEnv === 'development' ? true : corsConfig.origin
app.use(
  cors({
    origin: corsOrigin,
    credentials: corsOrigin !== '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ─── Static Files (Assets) — ANTES del rate limiter ────────────────────────────
const path = require('path')
const assetsPath = path.join(__dirname, '../../LALAND_FOOTBALL_ASSETS')
app.use('/assets', express.static(assetsPath))

// ─── Health check — ANTES del rate limiter ─────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: nodeEnv, timestamp: new Date().toISOString() })
})

// ─── Logging ───────────────────────────────────────────────────────────────────
if (nodeEnv === 'development') {
  app.use(morgan('dev'))
}

const globalLimiter = rateLimit({
  windowMs: rlConfig.windowMs,
  max: rlConfig.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Demasiadas solicitudes, intentá más tarde.' },
})

const authLimiter = rateLimit({
  windowMs: rlConfig.windowMs,
  max: rlConfig.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Demasiados intentos de inicio de sesión, intentá más tarde.' },
})

// Rate limiter para rutas API (NO afecta /assets ni /health)
app.use('/api', globalLimiter)

// ─── Parsing ───────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// ─── Rutas de la API ───────────────────────────────────────────────────────────
// Se irán montando por fase:
// app.use('/api/auth', require('./routes/auth'))        — Fase 2
app.use('/api/auth', authLimiter, require('./routes/auth'))         // Fase 2
app.use('/api/uploads', require('./routes/uploads'))   // File uploads
app.use('/api/coaches', require('./routes/coaches'))   // Coaches
app.use('/api/teams', require('./routes/teams'))       // Fase 3
app.use('/api/players', require('./routes/players'))   // Fase 3
app.use('/api/leagues', require('./routes/leagues'))   // Fase 3
app.use('/api/matches', require('./routes/matches'))   // Fase 3
app.use('/api/stadiums', require('./routes/stadiums')) // Fase A
app.use('/api/match-videos', require('./routes/matchVideos')) // Videos
app.use('/api/admin', require('./routes/admin'))       // Fase 7
// ... etc.

// ─── 404 y Error handler ───────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = app
