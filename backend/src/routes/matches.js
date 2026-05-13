const express = require('express')
const { authenticate, requireRole } = require('../middlewares/auth')
const { getMatches, getMatchById, createMatch, updateMatch, addEvent, deleteMatch } = require('../controllers/matchesController')

const router = express.Router()

router.get('/', getMatches)
router.get('/:id', getMatchById)
router.post('/', authenticate, requireRole('admin', 'super_admin'), createMatch)
router.put('/:id', authenticate, requireRole('admin', 'super_admin'), updateMatch)
router.patch('/:id/events', authenticate, requireRole('admin', 'super_admin'), addEvent)
router.delete('/:id', authenticate, requireRole('super_admin'), deleteMatch)

module.exports = router
