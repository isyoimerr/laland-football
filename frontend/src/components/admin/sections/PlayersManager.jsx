import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDetailLink } from '@utils/linkHelpers'
import { getPlayerPhotoPath, getTeamInitials } from '@utils/imageUtils'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@services/api'
import DataTable from '@components/ui/DataTable'
import useAuthStore from '@store/authStore'
import { canEdit as hasEditAccess, canDelete as hasDeleteAccess } from '@utils/permissions'
import ImageWithFallback from '@components/common/ImageWithFallback'

const POSITIONS = ['Portero', 'Defensa', 'Centrocampista', 'Delantero']
const EMPTY_FORM = { name: '', team_id: '', position: '', number: '', nationality: '', height: '', weight: '', photo_path: '' }

function ManagerForm({ form, setForm, onSubmit, onCancel, editingId, teams, onPhotoUpload, uploadingPhoto }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      className="card p-5"
    >
      <h3 className="section-title text-sm mb-4">{editingId ? 'Editar Jugador' : 'Nuevo Jugador'}</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Nombre *</label>
            <input
              type="text"
              className="input-base"
              placeholder="ej: Lionel Messi"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Equipo *</label>
            <select
              className="input-base"
              value={form.team_id}
              onChange={e => setForm(f => ({ ...f, team_id: e.target.value }))}
              required
            >
              <option value="">Seleccionar equipo</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Posición</label>
            <select
              className="input-base"
              value={form.position}
              onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
            >
              <option value="">Sin posición</option>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Número</label>
            <input
              type="number"
              min="1" max="99"
              className="input-base"
              placeholder="ej: 10"
              value={form.number}
              onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Nacionalidad</label>
            <input
              type="text"
              className="input-base"
              placeholder="ej: Argentina"
              value={form.nationality}
              onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Altura (cm)</label>
            <input
              type="number"
              step="0.01"
              className="input-base"
              placeholder="ej: 170"
              value={form.height}
              onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Foto</label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="input-base flex-1"
                onChange={e => onPhotoUpload(e.target.files?.[0], setForm)}
                disabled={uploadingPhoto}
              />
            </div>
            {form.photo_path && <p className="text-2xs text-text-muted mt-1">✓ {form.photo_path}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button type="submit" className="btn-primary" disabled={uploadingPhoto}>{editingId ? 'Actualizar' : 'Crear Jugador'}</button>
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={uploadingPhoto}>Cancelar</button>
        </div>
      </form>
    </motion.div>
  )
}

export default function PlayersManager() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const { user } = useAuthStore()
  const canEdit = hasEditAccess(user)
  const canDelete = hasDeleteAccess(user)
  const navigate = useNavigate()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handlePhotoUpload = async (file, setFormFn) => {
    if (!file) return
    setUploadingPhoto(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/uploads/jugadores', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (res.data.status === 'success') {
        setFormFn(f => ({ ...f, photo_path: res.data.data.path }))
        showToast('Foto cargada')
      }
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al cargar foto', 'error')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [playersRes, teamsRes] = await Promise.all([
        api.get('/players'),
        api.get('/teams'),
      ])
      setPlayers(playersRes.data.data.players)
      setTeams(teamsRes.data.data.teams)
    } catch { showToast('Error al cargar datos', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: form.name,
        team_id: form.team_id ? Number(form.team_id) : null,
        position: form.position || null,
        number: form.number ? Number(form.number) : null,
        nationality: form.nationality || null,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        photo_path: form.photo_path || null,
      }
      if (editingId) {
        await api.put(`/players/${editingId}`, payload)
        showToast('Jugador actualizado')
      } else {
        await api.post('/players', payload)
        showToast('Jugador creado')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al guardar', 'error')
    }
  }

  const handleEdit = (player) => {
    setEditingId(player.id)
    setForm({
      name: player.name ?? '',
      team_id: player.team_id ?? '',
      position: player.position ?? '',
      number: player.number ?? '',
      nationality: player.nationality ?? '',
      height: player.height ?? '',
      weight: player.weight ?? '',
      photo_path: player.photo_path ?? '',
    })
    setShowForm(true)
  }

  const handleDelete = async (player) => {
    if (!window.confirm(`¿Eliminar al jugador "${player.name}"?`)) return
    try {
      await api.delete(`/players/${player.id}`)
      showToast('Jugador eliminado')
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al eliminar', 'error')
    }
  }

  const columns = [
    {
      key: 'photo_path', label: 'Foto', sortable: false,
      render: row => (
        <ImageWithFallback
          src={row.photo_path || getPlayerPhotoPath(row.name)}
          alt={row.name}
          type="player"
          initials={getTeamInitials(row.name)}
          className="w-8 h-8 rounded-full"
        />
      ),
    },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'position', label: 'Posición', sortable: true },
    { key: 'number', label: '#', sortable: true },
    {
      key: 'Team', label: 'Equipo', sortable: false,
      render: row => row.Team?.name ?? '—',
    },
    { key: 'nationality', label: 'Nac.', sortable: false },
  ]

  return (
    <div className="space-y-4 max-w-5xl">
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

      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Jugadores</h2>
          <p className="text-2xs text-text-muted mt-0.5">{players.length} jugador{players.length !== 1 ? 'es' : ''} registrado{players.length !== 1 ? 's' : ''}</p>
        </div>
        {canEdit && (
          <button onClick={showForm ? () => setShowForm(false) : () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true) }} className="btn-primary">
            {showForm ? 'Cerrar' : '+ Nuevo Jugador'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && canEdit && (
          <ManagerForm
            form={form} setForm={setForm}
            onSubmit={handleSubmit} onCancel={() => setShowForm(false)}
            editingId={editingId} teams={teams}
            onPhotoUpload={handlePhotoUpload} uploadingPhoto={uploadingPhoto}
          />
        )}
      </AnimatePresence>

      <DataTable
        data={players}
        columns={columns}
        loading={loading}
        onEdit={canEdit ? handleEdit : null}
        onDelete={canDelete ? handleDelete : null}
        onRowClick={(row) => navigate(getDetailLink('player', row))}
      />
    </div>
  )
}
