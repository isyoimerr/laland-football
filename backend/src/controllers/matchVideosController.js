const { MatchVideo, MatchVideoPlayer, Match, Player, Team } = require('../models')

const getMatchVideos = async (req, res) => {
  try {
    const { match_id, category } = req.query
    const where = {}
    if (match_id) where.match_id = match_id
    if (category) where.category = category

    const videos = await MatchVideo.findAll({
      where,
      include: [
        {
          model: MatchVideoPlayer,
          as: 'players',
          include: [
            { model: Player, attributes: ['id', 'name', 'photo_path'] },
            { model: Team, attributes: ['id', 'name'] },
          ],
        },
      ],
      order: [['order', 'ASC'], ['created_at', 'DESC']],
    })
    res.json({ status: 'success', data: { videos } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getVideoById = async (req, res) => {
  try {
    const { id } = req.params
    const video = await MatchVideo.findByPk(id, {
      include: [
        {
          model: MatchVideoPlayer,
          as: 'players',
          include: [
            { model: Player, attributes: ['id', 'name', 'photo_path'] },
            { model: Team, attributes: ['id', 'name'] },
          ],
        },
        { model: Match, attributes: ['id', 'home_score', 'away_score', 'match_date'] },
      ],
    })
    if (!video) {
      return res.status(404).json({ status: 'error', message: 'Video no encontrado' })
    }
    res.json({ status: 'success', data: { video } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const createVideo = async (req, res) => {
  try {
    const { match_id, title, description, video_path, thumbnail_path, category, duration } = req.body
    if (!match_id || !title || !video_path) {
      return res.status(400).json({ status: 'error', message: 'match_id, title y video_path son requeridos' })
    }

    const video = await MatchVideo.create({
      match_id,
      title,
      description,
      video_path,
      thumbnail_path,
      category: category || 'highlights',
      duration: duration || null,
    })
    res.status(201).json({ status: 'success', data: { video } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params
    const video = await MatchVideo.findByPk(id)
    if (!video) {
      return res.status(404).json({ status: 'error', message: 'Video no encontrado' })
    }

    const { title, description, video_path, thumbnail_path, category, duration, order } = req.body
    const updates = {}
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (video_path !== undefined) updates.video_path = video_path
    if (thumbnail_path !== undefined) updates.thumbnail_path = thumbnail_path
    if (category !== undefined) updates.category = category
    if (duration !== undefined) updates.duration = duration
    if (order !== undefined) updates.order = order

    await video.update(updates)
    res.json({ status: 'success', data: { video } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params
    const video = await MatchVideo.findByPk(id)
    if (!video) {
      return res.status(404).json({ status: 'error', message: 'Video no encontrado' })
    }
    await MatchVideoPlayer.destroy({ where: { match_video_id: id } })
    await video.destroy()
    res.json({ status: 'success', message: 'Video eliminado' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const addPlayerToVideo = async (req, res) => {
  try {
    const { id } = req.params
    const { player_id, team_id, minute_appears, notes } = req.body

    const video = await MatchVideo.findByPk(id)
    if (!video) {
      return res.status(404).json({ status: 'error', message: 'Video no encontrado' })
    }

    const link = await MatchVideoPlayer.create({
      match_video_id: id,
      player_id,
      team_id,
      minute_appears,
      notes,
    })
    res.status(201).json({ status: 'success', data: { link } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const removePlayerFromVideo = async (req, res) => {
  try {
    const { id, playerId } = req.params
    await MatchVideoPlayer.destroy({
      where: { match_video_id: id, player_id: playerId },
    })
    res.json({ status: 'success', message: 'Jugador eliminado del video' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = {
  getMatchVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  addPlayerToVideo,
  removePlayerFromVideo,
}
