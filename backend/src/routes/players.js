const express = require('express')
const { authenticate, requireRole } = require('../middlewares/auth')
const { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer, getPlayerPhoto, getPlayerStats } = require('../controllers/playersController')

const router = express.Router()

router.get('/', getPlayers)
router.get('/:id/photo', getPlayerPhoto)
router.get('/:id/stats', getPlayerStats)
router.get('/:id', getPlayerById)
router.post('/', authenticate, requireRole('admin', 'super_admin'), createPlayer)
router.put('/:id', authenticate, requireRole('admin', 'super_admin'), updatePlayer)
router.delete('/:id', authenticate, requireRole('super_admin'), deletePlayer)

module.exports = router
