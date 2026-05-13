const path = require('path')
const fs = require('fs')
const { Stadium } = require('../models')
const ASSETS_ROOT = path.join(__dirname, '../../../LALAND_FOOTBALL_ASSETS')

const getStadiums = async (req, res) => {
  try {
    const stadiums = await Stadium.findAll({ order: [['name', 'ASC']] })
    res.json({ status: 'success', data: { stadiums } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getStadiumById = async (req, res) => {
  try {
    const { id } = req.params
    const stadium = await Stadium.findByPk(id)
    if (!stadium) {
      return res.status(404).json({ status: 'error', message: 'Estadio no encontrado' })
    }
    res.json({ status: 'success', data: { stadium } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const createStadium = async (req, res) => {
  try {
    const { name, city, country, capacity, image_path } = req.body
    const stadium = await Stadium.create({ name, city, country, capacity, image_path })
    res.status(201).json({ status: 'success', data: { stadium } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const updateStadium = async (req, res) => {
  try {
    const { id } = req.params
    const { name, city, country, capacity, image_path } = req.body
    const stadium = await Stadium.findByPk(id)
    if (!stadium) {
      return res.status(404).json({ status: 'error', message: 'Estadio no encontrado' })
    }
    await stadium.update({ name, city, country, capacity, image_path })
    res.json({ status: 'success', data: { stadium } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const deleteStadium = async (req, res) => {
  try {
    const { id } = req.params
    const stadium = await Stadium.findByPk(id)
    if (!stadium) {
      return res.status(404).json({ status: 'error', message: 'Estadio no encontrado' })
    }
    await stadium.destroy()
    res.json({ status: 'success', message: 'Estadio eliminado' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

const getStadiumPhoto = async (req, res) => {
  try {
    const { id } = req.params
    const stadium = await Stadium.findByPk(id)
    if (!stadium) return res.status(404).json({ status: 'error', message: 'Estadio no encontrado' })
    const p = stadium.image_path
    if (!p) return res.status(404).json({ status: 'error', message: 'Imagen no disponible' })
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

module.exports = { getStadiums, getStadiumById, createStadium, updateStadium, deleteStadium, getStadiumPhoto }
