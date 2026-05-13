const express = require('express')
const { authenticate, requireRole } = require('../middlewares/auth')
const { getLeagues, getLeagueById, getStandings, createLeague, updateLeague, deleteLeague, getLeagueLogo } = require('../controllers/leaguesController')

const router = express.Router()

router.get('/', getLeagues)
router.get('/:id/logo', getLeagueLogo)
router.get('/:id', getLeagueById)
router.get('/:id/standings', getStandings)
router.post('/', authenticate, requireRole('super_admin'), createLeague)
router.put('/:id', authenticate, requireRole('super_admin'), updateLeague)
router.delete('/:id', authenticate, requireRole('super_admin'), deleteLeague)

module.exports = router
