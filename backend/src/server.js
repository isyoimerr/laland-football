require('./config/env')
const http = require('http')
const { Server: SocketServer } = require('socket.io')
const app = require('./app')
const sequelize = require('./config/database')
const { port, cors: corsConfig, nodeEnv } = require('./config/env')

// Cargar modelos
require('./models')

const httpServer = http.createServer(app)

// ─── Socket.io ─────────────────────────────────────────────────────────────────
const io = new SocketServer(httpServer, {
  cors: {
    origin: corsConfig.origin,
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.info(`[Socket] Cliente conectado: ${socket.id}`)

  socket.on('subscribe:match', (matchId) => {
    socket.join(`match:${matchId}`)
    console.info(`[Socket] ${socket.id} suscrito a match:${matchId}`)
  })

  socket.on('unsubscribe:match', (matchId) => {
    socket.leave(`match:${matchId}`)
  })

  socket.on('match:update', async (data) => {
    const { matchId, homeScore, awayScore, status } = data
    io.to(`match:${matchId}`).emit('match:updated', {
      matchId, homeScore, awayScore, status, timestamp: new Date().toISOString(),
    })
  })

  socket.on('match:event', async (data) => {
    const { matchId, event } = data
    io.to(`match:${matchId}`).emit('match:newEvent', {
      matchId, event, timestamp: new Date().toISOString(),
    })
    io.emit('ticker:update', {
      type: 'event',
      matchId,
      description: `${event.minute}' - ${event.description || 'Nuevo evento'}`,
      timestamp: new Date().toISOString(),
    })
  })

  socket.on('disconnect', () => {
    console.info(`[Socket] Cliente desconectado: ${socket.id}`)
  })
})

setInterval(() => {
  io.emit('ping', { timestamp: new Date().toISOString() })
}, 30000)

// ─── Arranque ─────────────────────────────────────────────────────────────────

async function connectWithRetry(maxRetries = 5, baseDelayMs = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.authenticate()
      console.info('[DB] Conexión a MySQL establecida correctamente')
      return true
    } catch (err) {
      console.error(`[DB] Intento ${attempt} fallido: ${err.message}`)
      if (attempt === maxRetries) {
        console.error('[DB] Todos los intentos de conexión fallaron')
        return false
      }
      const delay = baseDelayMs * Math.pow(2, attempt - 1)
      console.info(`[DB] Reintentando en ${delay}ms...`)
      await new Promise((res) => setTimeout(res, delay))
    }
  }
  return false
}

function listenOnAvailablePort(startPort, maxTries = 5) {
  return new Promise((resolve, reject) => {
    let tryPort = startPort
    let attempts = 0

    const attemptListen = () => {
      attempts++

      const onError = (err) => {
        if (err && err.code === 'EADDRINUSE') {
          console.warn(`[Server] Puerto ${tryPort} en uso, intentando ${tryPort + 1} (${attempts}/${maxTries})`)
          if (attempts >= maxTries) {
            httpServer.removeListener('error', onError)
            reject(new Error('No hay puertos disponibles'))
            return
          }
          httpServer.removeListener('error', onError)
          tryPort++
          // pequeña espera antes de reintentar
          setTimeout(attemptListen, 200)
        } else {
          httpServer.removeListener('error', onError)
          reject(err)
        }
      }

      httpServer.once('error', onError)
      httpServer.once('listening', () => {
        httpServer.removeListener('error', onError)
        resolve(tryPort)
      })

      httpServer.listen(tryPort)
    }

    attemptListen()
  })
}

async function start() {
  const dbMaxRetries = parseInt(process.env.DB_CONN_MAX_RETRIES, 10) || 5
  const dbBaseDelay = parseInt(process.env.DB_CONN_RETRY_MS, 10) || 1000
  const portMaxRetries = parseInt(process.env.PORT_RETRY_MAX, 10) || 5

  try {
    const connected = await connectWithRetry(dbMaxRetries, dbBaseDelay)

    if (connected) {
      if (nodeEnv === 'development') {
        // sync solo en dev — en producción se usan migraciones
        await sequelize.sync({ alter: false })
      }
    } else {
      console.error('[Server] Iniciando en modo degradado — la base de datos no está disponible')
    }

    const chosenPort = await listenOnAvailablePort(port, portMaxRetries)

    console.info(`[Server] LALAND Football API corriendo en http://localhost:${chosenPort}`)
    console.info(`[Server] Entorno: ${nodeEnv}`)
  } catch (err) {
    console.error('[Server] Error al iniciar:', err.message)
    // No dejar errores no manejados; salir con código 1 para que el proceso supervisor lo reinicie si se desea
    process.exit(1)
  }
}

start()

module.exports = { io }
