const express = require('express')
const multer = require('multer')
const { authenticate, requireRole } = require('../middlewares/auth')
const { uploadImage } = require('../controllers/uploadsController')

const router = express.Router()

// Multer: store file in memory, limit 200MB for videos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de archivo no permitido'))
    }
  },
})

// POST /api/uploads/equipos, /api/uploads/jugadores, /api/uploads/ligas, /api/uploads/estadios, /api/uploads/videos
router.post('/:category', authenticate, requireRole('admin', 'super_admin'), upload.single('file'), uploadImage)

module.exports = router
