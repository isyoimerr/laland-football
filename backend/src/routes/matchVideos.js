const express = require('express')
const { authenticate, requireRole } = require('../middlewares/auth')
const {
  getMatchVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  addPlayerToVideo,
  removePlayerFromVideo,
} = require('../controllers/matchVideosController')

const router = express.Router()

router.get('/', getMatchVideos)
router.get('/:id', getVideoById)
router.post('/', authenticate, requireRole('admin', 'super_admin'), createVideo)
router.put('/:id', authenticate, requireRole('admin', 'super_admin'), updateVideo)
router.delete('/:id', authenticate, requireRole('super_admin'), deleteVideo)
router.post('/:id/players', authenticate, requireRole('admin', 'super_admin'), addPlayerToVideo)
router.delete('/:id/players/:playerId', authenticate, requireRole('admin', 'super_admin'), removePlayerFromVideo)

module.exports = router
