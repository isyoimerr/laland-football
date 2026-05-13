const { Op } = require('sequelize')
const { Team, League, Player } = require('../models')

const getTeams = async (req, res) => {
  try {
    const { search } = req.query
    const where = {}
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { country: { [Op.like]: `%${search}%` } },
      ]
    }
    const teams = await Team.findAll({
      where,
      include: [
        { model: League, attributes: ['id', 'name', 'slug'] },
        { model: Player, attributes: ['id', 'name', 'position', 'number'], limit: 5 },
      ],
    })
    res.json({ status: 'success', data: { teams } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getTeamById = async (req, res) => {
  try {
    const { id } = req.params
    const team = await Team.findByPk(id, {
      include: [
        { model: League },
        { model: Player },
      ],
    })
    if (!team) {
      return res.status(404).json({ status: 'error', message: 'Equipo no encontrado' })
    }
    res.json({ status: 'success', data: { team } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const createTeam = async (req, res) => {
  try {
    const { name, slug, league_id, country, logo_path, background_path } = req.body
    const existingTeam = await Team.findOne({ where: { slug } })
    if (existingTeam) {
      return res.status(409).json({ status: 'error', message: 'El slug del equipo ya existe' })
    }
    const team = await Team.create({
      name,
      slug,
      league_id,
      country,
      logo_path,
      background_path,
    })
    res.status(201).json({ status: 'success', data: { team } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params
    const { name, league_id, country, logo_path, background_path } = req.body
    const team = await Team.findByPk(id)
    if (!team) {
      return res.status(404).json({ status: 'error', message: 'Equipo no encontrado' })
    }
    await team.update({ name, league_id, country, logo_path, background_path })
    res.json({ status: 'success', data: { team } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params
    const team = await Team.findByPk(id)
    if (!team) {
      return res.status(404).json({ status: 'error', message: 'Equipo no encontrado' })
    }
    await team.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
}
