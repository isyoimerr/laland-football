import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@services/api'
import useAuthStore from '@store/authStore'
import { canEdit as hasEditAccess, canDelete as hasDeleteAccess } from '@utils/permissions'
import VideoPlayer from '@components/common/VideoPlayer'

const CATEGORIES = [
  { value: 'highlights', label: 'Highlights', color: 'text-accent-green' },
  { value: 'clasicos', label: 'Clásicos', color: 'text-accent-blue' },
  { value: 'goles', label: 'Goles', color: 'text-accent-yellow' },
  { value: 'skills', label: 'Skills', color: 'text-accent-teal' },
]

const CATEGORY_LABEL = { highlights: 'Highlights', clasicos: 'Clásicos', goles: 'Goles', skills: 'Skills' }

const EMPTY_FORM = { match_id: '', title: '', description: '', video_path: '', thumbnail_path: '', category: 'highlights', duration: '' }

function VideosManager() {
  const [videos, setVideos] = useState([])
  const [matches, setMatches] = useState([])
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [filterCat, setFilterCat] = useState('')
  const { user } = useAuthStore()
  const canEdit = hasEditAccess(user)
  const canDelete = hasDeleteAccess(user)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchAll = async () => {
    setLoading(true)
    try {
      const params = filterCat ? `?category=${filterCat}` : ''
      const [videoRes, matchRes, playerRes] = await Promise.all([
        api.get(`/match-videos${params}`),
        api.get('/matches'),
        api.get('/players'),
      ])
      setVideos(videoRes.data.data.videos)
      setMatches(matchRes.data.data.matches)
      setPlayers(playerRes.data.data.players)
    } catch { showToast('Error al cargar datos', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [filterCat])

  const handleFileUpload = async (file, type) => {
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/uploads/videos', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (res.data.status === 'success') {
        if (type === 'video') setForm(f => ({ ...f, video_path: res.data.data.path }))
        else setForm(f => ({ ...f, thumbnail_path: res.data.data.path }))
        showToast(`${type === 'video' ? 'Video' : 'Miniatura'} subido`)
      }
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al subir archivo', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        match_id: Number(form.match_id),
        title: form.title,
        description: form.description || null,
        video_path: form.video_path,
        thumbnail_path: form.thumbnail_path || null,
        category: form.category,
        duration: form.duration ? Number(form.duration) : null,
      }

      if (editingId) {
        await api.put(`/match-videos/${editingId}`, payload)
        showToast('Video actualizado')
      } else {
        await api.post('/match-videos', payload)
        showToast('Video creado')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al guardar', 'error')
    }
  }

  const handleEdit = (video) => {
    setEditingId(video.id)
    setForm({
      match_id: video.match_id,
      title: video.title,
      description: video.description ?? '',
      video_path: video.video_path,
      thumbnail_path: video.thumbnail_path ?? '',
      category: video.category,
      duration: video.duration ?? '',
    })
    setShowForm(true)
  }

  const handleDelete = async (video) => {
    if (!window.confirm(`¿Eliminar el video "${video.title}"?`)) return
    try {
      await api.delete(`/match-videos/${video.id}`)
      showToast('Video eliminado')
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al eliminar', 'error')
    }
  }

  return (
    <div className="space-y-4 max-w-6xl">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-xs font-semibold shadow-card ${
              toast.type === 'error' ? 'bg-accent-red/20 border border-accent-red/30 text-accent-red' : 'bg-accent-green/20 border border-accent-green/30 text-accent-green'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="section-title">Videos</h2>
          <p className="text-2xs text-text-muted mt-0.5">{videos.length} video{videos.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input-base text-xs py-1.5" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">Todas las categorías</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          {canEdit && (
            <button onClick={showForm ? () => setShowForm(false) : () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true) }} className="btn-primary">
              {showForm ? 'Cerrar' : '+ Nuevo Video'}
            </button>
          )}
        </div>
      </div>

      {/* Reproductor */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="card p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary">{selectedVideo.title}</h3>
              <button onClick={() => setSelectedVideo(null)} className="btn-ghost p-1 text-text-muted hover:text-text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <VideoPlayer
              src={selectedVideo.video_path}
              poster={selectedVideo.thumbnail_path}
              title={selectedVideo.title}
            />
            {selectedVideo.description && (
              <p className="text-xs text-text-muted">{selectedVideo.description}</p>
            )}
            {selectedVideo.players?.length > 0 && (
              <div className="space-y-1">
                <p className="text-2xs text-text-muted uppercase tracking-wide font-semibold">Jugadores en este video:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVideo.players.map(vp => (
                    <span key={vp.id} className="text-2xs bg-bg-tertiary px-2 py-1 rounded text-text-primary">
                      {vp.Player?.name ?? `#${vp.player_id}`}
                      {vp.Team && <span className="text-text-muted ml-1">({vp.Team.name})</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario */}
      <AnimatePresence>
        {showForm && canEdit && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="card p-5"
          >
            <h3 className="section-title text-sm mb-4">{editingId ? 'Editar Video' : 'Nuevo Video'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-2xs text-text-muted uppercase tracking-wide">Partido *</label>
                  <select className="input-base" value={form.match_id} onChange={e => setForm(f => ({ ...f, match_id: e.target.value }))} required>
                    <option value="">Seleccionar partido</option>
                    {matches.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.homeTeam?.name ?? '?'} vs {m.awayTeam?.name ?? '?'} — {new Date(m.match_date).toLocaleDateString('es-ES')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-2xs text-text-muted uppercase tracking-wide">Título *</label>
                  <input type="text" className="input-base" placeholder="ej: Resumen del partido" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-2xs text-text-muted uppercase tracking-wide">Descripción</label>
                  <textarea className="input-base" rows={2} placeholder="Descripción del video..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-2xs text-text-muted uppercase tracking-wide">Categoría</label>
                  <select className="input-base" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-2xs text-text-muted uppercase tracking-wide">Duración (segundos)</label>
                  <input type="number" className="input-base" placeholder="ej: 120" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-2xs text-text-muted uppercase tracking-wide">Archivo de Video</label>
                  <div className="flex gap-2">
                    <input type="file" accept="video/mp4,video/webm" className="input-base flex-1" onChange={e => handleFileUpload(e.target.files?.[0], 'video')} disabled={uploading} />
                  </div>
                  {form.video_path && <p className="text-2xs text-text-muted mt-1">✓ {form.video_path.split('/').pop()}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-2xs text-text-muted uppercase tracking-wide">Miniatura</label>
                  <div className="flex gap-2">
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="input-base flex-1" onChange={e => handleFileUpload(e.target.files?.[0], 'thumbnail')} disabled={uploading} />
                  </div>
                  {form.thumbnail_path && <p className="text-2xs text-text-muted mt-1">✓ {form.thumbnail_path.split('/').pop()}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button type="submit" className="btn-primary" disabled={uploading}>{editingId ? 'Actualizar' : 'Crear Video'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" disabled={uploading}>Cancelar</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid de videos */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-video" />
              <div className="p-3 space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="card p-8 text-center text-text-muted text-xs">
          No hay videos. Creá uno nuevo.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(video => (
            <motion.div
              key={video.id}
              layout
              className="card overflow-hidden group cursor-pointer hover:border-border-light transition-colors"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video bg-black">
                {video.thumbnail_path ? (
                  <img src={video.thumbnail_path} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-bg-tertiary">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-text-muted"><polygon points="8,5 19,12 8,19" fill="currentColor" /></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-accent-green/90 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19" /></svg>
                  </div>
                </div>
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-2xs px-1.5 py-0.5 rounded font-mono">
                    {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                  </span>
                )}
                <span className={`absolute top-2 left-2 text-2xs font-semibold px-1.5 py-0.5 rounded bg-black/60 ${CATEGORIES.find(c => c.value === video.category)?.color ?? 'text-white'}`}>
                  {CATEGORY_LABEL[video.category] ?? video.category}
                </span>
              </div>
              <div className="p-3 space-y-1.5">
                <h4 className="text-xs font-bold text-text-primary truncate">{video.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xs text-text-muted">
                    {video.Match ? `${video.Match.home_score ?? '?'} – ${video.Match.away_score ?? '?'}` : 'Sin partido'}
                  </span>
                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <button onClick={e => { e.stopPropagation(); handleEdit(video) }} className="btn-ghost p-1 text-text-muted hover:text-accent-blue">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={e => { e.stopPropagation(); handleDelete(video) }} className="btn-ghost p-1 text-text-muted hover:text-accent-red">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VideosManager
