const path = require('path')
const fs = require('fs')
const ASSETS_ROOT = path.join(__dirname, '../../../LALAND_FOOTBALL_ASSETS')

const categoryMap = {
  equipos: { dir: 'EQUIPOS', isVideo: false },
  jugadores: { dir: 'MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS', isVideo: false },
  ligas: { dir: 'LIGAS', isVideo: false },
  estadios: { dir: 'MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS', isVideo: false },
  videos: { dir: 'VIDEOS', isVideo: true },
}

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' })
    }

    const { category } = req.params
    const config = categoryMap[category?.toLowerCase()]
    if (!config) {
      return res.status(400).json({ status: 'error', message: 'Categoría inválida' })
    }

    const targetDir = path.join(ASSETS_ROOT, config.dir)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    const ext = path.extname(req.file.originalname) || (config.isVideo ? '.mp4' : '.png')
    const base = path.basename(req.file.originalname, ext)
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .substring(0, 100)
    const ts = Date.now()
    const filename = `${base}_${ts}${ext}`
    const newPath = path.join(targetDir, filename)
    fs.writeFileSync(newPath, req.file.buffer)

    const relativePath = `/assets/${config.dir}/${filename}`
    res.json({ status: 'success', data: { path: relativePath } })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

module.exports = { uploadImage }
