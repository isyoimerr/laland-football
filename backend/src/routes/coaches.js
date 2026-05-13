const express = require('express')
const { authenticate, requireRole } = require('../middlewares/auth')
const { getCoaches, getCoachById, createCoach, updateCoach, deleteCoach } = require('../controllers/coachesController')

const router = express.Router()

router.get('/', getCoaches)
router.get('/:id', getCoachById)
router.post('/', authenticate, requireRole('admin', 'super_admin'), createCoach)
router.put('/:id', authenticate, requireRole('admin', 'super_admin'), updateCoach)
router.delete('/:id', authenticate, requireRole('super_admin'), deleteCoach)

module.exports = router
