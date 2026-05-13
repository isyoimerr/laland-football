const { Match, MatchEvent, Team, League, Stadium, Player } = require('../models')
const { Op } = require('sequelize')

const getMatches = async (req, res) => {
  try {
    const { status, team_id, league_id } = req.query
    const where = {}
    if (status) where.status = status
    if (team_id) {
      where[Op.or] = [
        { home_team_id: team_id },
        { away_team_id: team_id },
      ]
    }
    if (league_id) where.league_id = league_id

    const matches = await Match.findAll({
      where,
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id', 'name', 'slug', 'logo_path'] },
        { model: Team, as: 'awayTeam', attributes: ['id', 'name', 'slug', 'logo_path'] },
        { model: League, attributes: ['id', 'name', 'slug'] },
        { model: Stadium, attributes: ['id', 'name', 'city'] },
      ],
      order: [['match_date', 'DESC']],
    })
    res.json({ status: 'success', data: { matches } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getMatchById = async (req, res) => {
  try {
    const { id } = req.params
    const match = await Match.findByPk(id, {
      include: [
        { model: Team, as: 'homeTeam' },
        { model: Team, as: 'awayTeam' },
        { model: League },
        { model: Stadium },
        { model: MatchEvent, include: [{ model: Player, attributes: ['id', 'name'] }] },
      ],
    })
    if (!match) {
      return res.status(404).json({ status: 'error', message: 'Partido no encontrado' })
    }
    res.json({ status: 'success', data: { match } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const createMatch = async (req, res) => {
  try {
    const { home_team_id, away_team_id, league_id, stadium_id, match_date, status } = req.body
    const match = await Match.create({
      home_team_id,
      away_team_id,
      league_id,
      stadium_id,
      match_date,
      status: status || 'scheduled',
      home_score: 0,
      away_score: 0,
    })
    res.status(201).json({ status: 'success', data: { match } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const updateMatch = async (req, res) => {
  try {
    const { id } = req.params
    const { home_score, away_score, status, match_date, league_id, stadium_id, home_team_id, away_team_id } = req.body
    const match = await Match.findByPk(id)
    if (!match) {
      return res.status(404).json({ status: 'error', message: 'Partido no encontrado' })
    }
    const updates = {}
    if (home_score !== undefined) updates.home_score = home_score
    if (away_score !== undefined) updates.away_score = away_score
    if (status !== undefined) updates.status = status
    if (match_date !== undefined) updates.match_date = match_date
    if (league_id !== undefined) updates.league_id = league_id
    if (stadium_id !== undefined) updates.stadium_id = stadium_id
    if (home_team_id !== undefined) updates.home_team_id = home_team_id
    if (away_team_id !== undefined) updates.away_team_id = away_team_id
    await match.update(updates)
    res.json({ status: 'success', data: { match } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const addEvent = async (req, res) => {
  try {
    const { id } = req.params
    const { type, player_id, team_id, minute, description } = req.body

    const match = await Match.findByPk(id)
    if (!match) {
      return res.status(404).json({ status: 'error', message: 'Partido no encontrado' })
    }

    const event = await MatchEvent.create({
      match_id: id,
      type,
      player_id,
      team_id,
      minute,
      description,
    })
    res.status(201).json({ status: 'success', data: { event } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params
    const match = await Match.findByPk(id)
    if (!match) {
      return res.status(404).json({ status: 'error', message: 'Partido no encontrado' })
    }
    await MatchEvent.destroy({ where: { match_id: id } })
    await match.destroy()
    res.json({ status: 'success', message: 'Partido eliminado' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  addEvent,
  deleteMatch,
}
