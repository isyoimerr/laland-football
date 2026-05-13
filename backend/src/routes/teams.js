const express = require('express')
const { authenticate, requireRole } = require('../middlewares/auth')
const { getTeams, getTeamById, createTeam, updateTeam, deleteTeam } = require('../controllers/teamsController')

const router = express.Router()

router.get('/', getTeams)
router.get('/:id', getTeamById)
router.post('/', authenticate, requireRole('admin', 'super_admin'), createTeam)
router.put('/:id', authenticate, requireRole('admin', 'super_admin'), updateTeam)
router.delete('/:id', authenticate, requireRole('super_admin'), deleteTeam)

module.exports = router
