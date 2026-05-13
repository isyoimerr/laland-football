const { Op } = require('sequelize')
const { Coach, Team } = require('../models')

const getCoaches = async (req, res) => {
  try {
    const { search, team_id } = req.query
    const where = {}
    if (search) {
      where.name = { [Op.like]: `%${search}%` }
    }
    if (team_id) where.team_id = team_id
    const coaches = await Coach.findAll({
      where,
      include: [{ model: Team, attributes: ['id', 'name', 'slug'] }],
    })
    res.json({ status: 'success', data: { coaches } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getCoachById = async (req, res) => {
  try {
    const { id } = req.params
    const coach = await Coach.findByPk(id, { include: [{ model: Team }] })
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Entrenador no encontrado' })
    }
    res.json({ status: 'success', data: { coach } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const createCoach = async (req, res) => {
  try {
    const { team_id, name, nationality, birth_date, photo_path, role } = req.body
    const coach = await Coach.create({ team_id, name, nationality, birth_date, photo_path, role })
    res.status(201).json({ status: 'success', data: { coach } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const updateCoach = async (req, res) => {
  try {
    const { id } = req.params
    const coach = await Coach.findByPk(id)
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Entrenador no encontrado' })
    }
    const { team_id, name, nationality, birth_date, photo_path, role } = req.body
    await coach.update({ team_id, name, nationality, birth_date, photo_path, role })
    res.json({ status: 'success', data: { coach } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const deleteCoach = async (req, res) => {
  try {
    const { id } = req.params
    const coach = await Coach.findByPk(id)
    if (!coach) {
      return res.status(404).json({ status: 'error', message: 'Entrenador no encontrado' })
    }
    await coach.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = { getCoaches, getCoachById, createCoach, updateCoach, deleteCoach }
