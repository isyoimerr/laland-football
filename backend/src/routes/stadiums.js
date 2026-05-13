const express = require('express')
const { authenticate, requireRole } = require('../middlewares/auth')
const { getStadiums, getStadiumById, createStadium, updateStadium, deleteStadium, getStadiumPhoto } = require('../controllers/stadiumsController')

const router = express.Router()

router.get('/', getStadiums)
router.get('/:id/photo', getStadiumPhoto)
router.get('/:id', getStadiumById)
router.post('/', authenticate, requireRole('admin', 'super_admin'), createStadium)
router.put('/:id', authenticate, requireRole('admin', 'super_admin'), updateStadium)
router.delete('/:id', authenticate, requireRole('super_admin'), deleteStadium)

module.exports = router
