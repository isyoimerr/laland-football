const path = require('path')
const fs = require('fs')
const { Op } = require('sequelize')
const { League, Team, sequelize } = require('../models')
const ASSETS_ROOT = path.join(__dirname, '../../../LALAND_FOOTBALL_ASSETS')

const getLeagues = async (req, res) => {
  try {
    const { search } = req.query
    const where = {}
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { country: { [Op.like]: `%${search}%` } },
      ]
    }
    const leagues = await League.findAll({
      where,
      include: [{ model: Team, attributes: ['id', 'name', 'slug'] }],
    })
    res.json({ status: 'success', data: { leagues } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getLeagueById = async (req, res) => {
  try {
    const { id } = req.params
    const league = await League.findByPk(id, {
      include: [{ model: Team }],
    })
    if (!league) {
      return res.status(404).json({ status: 'error', message: 'Liga no encontrada' })
    }
    res.json({ status: 'success', data: { league } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getStandings = async (req, res) => {
  try {
    const { id } = req.params
    const league = await League.findByPk(id)
    if (!league) {
      return res.status(404).json({ status: 'error', message: 'Liga no encontrada' })
    }

    const standings = await sequelize.query(`
      SELECT t.id, t.name, t.slug, t.logo_path,
        COUNT(CASE WHEN m.status = 'finished' THEN 1 END) as played,
        SUM(CASE WHEN m.status = 'finished' AND m.home_team_id = t.id AND m.home_score > m.away_score THEN 3
                 WHEN m.status = 'finished' AND m.away_team_id = t.id AND m.away_score > m.home_score THEN 3
                 WHEN m.status = 'finished' AND m.home_team_id = t.id AND m.home_score = m.away_score THEN 1
                 WHEN m.status = 'finished' AND m.away_team_id = t.id AND m.home_score = m.away_score THEN 1 ELSE 0 END) as points,
        SUM(CASE WHEN m.status = 'finished' AND m.home_team_id = t.id THEN m.home_score ELSE 0 END) +
        SUM(CASE WHEN m.status = 'finished' AND m.away_team_id = t.id THEN m.away_score ELSE 0 END) as goals_for,
        SUM(CASE WHEN m.status = 'finished' AND m.home_team_id = t.id THEN m.away_score ELSE 0 END) +
        SUM(CASE WHEN m.status = 'finished' AND m.away_team_id = t.id THEN m.home_score ELSE 0 END) as goals_against
      FROM teams t
      LEFT JOIN matches m ON ((m.home_team_id = t.id OR m.away_team_id = t.id) AND m.league_id = ?)
      WHERE t.league_id = ?
      GROUP BY t.id
      ORDER BY points DESC, goals_for DESC
    `, { replacements: [id, id], type: sequelize.QueryTypes.SELECT })

    res.json({ status: 'success', data: { standings } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const createLeague = async (req, res) => {
  try {
    const { name, slug, country, logo_path } = req.body
    const existingLeague = await League.findOne({ where: { slug } })
    if (existingLeague) {
      return res.status(409).json({ status: 'error', message: 'El slug de la liga ya existe' })
    }
    const league = await League.create({ name, slug, country, logo_path })
    res.status(201).json({ status: 'success', data: { league } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const updateLeague = async (req, res) => {
  try {
    const { id } = req.params
    const { name, country, logo_path } = req.body
    const league = await League.findByPk(id)
    if (!league) {
      return res.status(404).json({ status: 'error', message: 'Liga no encontrada' })
    }
    await league.update({ name, country, logo_path })
    res.json({ status: 'success', data: { league } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const deleteLeague = async (req, res) => {
  try {
    const { id } = req.params
    const league = await League.findByPk(id)
    if (!league) {
      return res.status(404).json({ status: 'error', message: 'Liga no encontrada' })
    }
    await league.destroy()
    res.json({ status: 'success', message: 'Liga eliminada' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getLeagueLogo = async (req, res) => {
  try {
    const { id } = req.params
    const league = await League.findByPk(id)
    if (!league) return res.status(404).json({ status: 'error', message: 'Liga no encontrada' })
    const p = league.logo_path
    if (!p) return res.status(404).json({ status: 'error', message: 'Logo no disponible' })
    if (p.startsWith('http://') || p.startsWith('https://')) return res.redirect(p)
    let rel = p.replace(/^\/assets\/?/, '')
    rel = rel.replace(/^\//, '')
    // Normalize top-level assets folder to match filesystem (EQUIPOS, LIGAS, MISCELÁNEOS...)
    const parts = rel.split('/')
    const top = parts[0] && parts[0].toUpperCase()
    const knownTop = ['EQUIPOS','LIGAS','MISCELÁNEOS','MISCELANEOS','VIDEOS']
    if (knownTop.includes(top)) parts[0] = top
    rel = parts.join('/')
    const filePath = path.join(ASSETS_ROOT, rel)
    if (!fs.existsSync(filePath)) return res.status(404).json({ status: 'error', message: 'Archivo no encontrado' })
    return res.sendFile(filePath)
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = {
  getLeagues,
  getLeagueById,
  getStandings,
  createLeague,
  updateLeague,
  deleteLeague,
  getLeagueLogo,
}
