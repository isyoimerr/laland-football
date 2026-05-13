const path = require('path')
const fs = require('fs')
const { Op } = require('sequelize')
const { Player, Team, MatchEvent, sequelize } = require('../models')
const ASSETS_ROOT = path.join(__dirname, '../../../LALAND_FOOTBALL_ASSETS')

const getPlayers = async (req, res) => {
  try {
    const { team_id, position, search } = req.query
    const where = {}
    if (team_id) where.team_id = team_id
    if (position) where.position = position
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { nationality: { [Op.like]: `%${search}%` } },
        { position: { [Op.like]: `%${search}%` } },
      ]
    }
    const players = await Player.findAll({
      where,
      include: [{ model: Team, attributes: ['id', 'name', 'slug'] }],
    })
    res.json({ status: 'success', data: { players } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getPlayerById = async (req, res) => {
  try {
    const { id } = req.params
    const player = await Player.findByPk(id, {
      include: [{ model: Team }],
    })
    if (!player) {
      return res.status(404).json({ status: 'error', message: 'Jugador no encontrado' })
    }
    res.json({ status: 'success', data: { player } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const createPlayer = async (req, res) => {
  try {
    const { team_id, name, position, number, nationality, height, weight, photo_path } = req.body
    const player = await Player.create({
      team_id,
      name,
      position,
      number,
      nationality,
      height,
      weight,
      photo_path,
    })
    res.status(201).json({ status: 'success', data: { player } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params
    const { team_id, name, position, number, nationality, height, weight, photo_path } = req.body
    const player = await Player.findByPk(id)
    if (!player) {
      return res.status(404).json({ status: 'error', message: 'Jugador no encontrado' })
    }
    await player.update({ team_id, name, position, number, nationality, height, weight, photo_path })
    res.json({ status: 'success', data: { player } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params
    const player = await Player.findByPk(id)
    if (!player) {
      return res.status(404).json({ status: 'error', message: 'Jugador no encontrado' })
    }
    await player.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getPlayerPhoto = async (req, res) => {
  try {
    const { id } = req.params
    const player = await Player.findByPk(id)
    if (!player) return res.status(404).json({ status: 'error', message: 'Jugador no encontrado' })
    const p = player.photo_path
    if (!p) return res.status(404).json({ status: 'error', message: 'Imagen no disponible' })

    // Absolute external URL -> redirect
    if (p.startsWith('http://') || p.startsWith('https://')) {
      return res.redirect(p)
    }

    // Normalize local asset path
    let rel = p.replace(/^\/assets\/?/, '')
    rel = rel.replace(/^\//, '')
    // Normalize top-level assets folder to match filesystem (EQUIPOS, LIGAS, MISCELÁNEOS...)
    const parts = rel.split('/')
    const top = parts[0] && parts[0].toUpperCase()
    const knownTop = ['EQUIPOS','LIGAS','MISCELÁNEOS','MISCELANEOS','VIDEOS']
    if (knownTop.includes(top)) parts[0] = top
    rel = parts.join('/')
    const filePath = path.join(ASSETS_ROOT, rel)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ status: 'error', message: 'Archivo no encontrado' })
    }
    return res.sendFile(filePath)
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getPlayerStats = async (req, res) => {
  try {
    const { id } = req.params
    const player = await Player.findByPk(id)
    if (!player) {
      return res.status(404).json({ status: 'error', message: 'Jugador no encontrado' })
    }
    const stats = await MatchEvent.findAll({
      where: { player_id: id },
      attributes: [
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('match_id'))), 'appearances'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN event_type = 'goal' THEN 1 ELSE 0 END")), 'goals'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN event_type = 'yellow_card' THEN 1 ELSE 0 END")), 'yellow_cards'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN event_type = 'red_card' THEN 1 ELSE 0 END")), 'red_cards'],
      ],
      raw: true,
    })
    const s = stats[0] || {}
    res.json({
      status: 'success',
      data: {
        stats: {
          appearances: Number(s.appearances) || 0,
          goals: Number(s.goals) || 0,
          yellow_cards: Number(s.yellow_cards) || 0,
          red_cards: Number(s.red_cards) || 0,
        },
      },
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = {
  getPlayers,
  getPlayerById,
  getPlayerStats,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getPlayerPhoto,
}
