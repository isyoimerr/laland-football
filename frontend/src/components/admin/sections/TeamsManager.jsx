import ImageWithFallback from '@components/common/ImageWithFallback'
import { getTeamLogoPath, getTeamInitials, getLeagueLogoPath } from '@utils/imageUtils'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@services/api'
import DataTable from '@components/ui/DataTable'
import useAuthStore from '@store/authStore'
import { canEdit as hasEditAccess, canDelete as hasDeleteAccess } from '@utils/permissions'
import { useNavigate } from 'react-router-dom'
import { getDetailLink } from '@utils/linkHelpers'
import { renderNameAsLink } from '@utils/linkHelpers'

const EMPTY_FORM = { name: '', slug: '', league_id: '', country: '', logo_path: '' }

function ManagerForm({ form, setForm, onSubmit, onCancel, editingId, leagues, onLogoUpload, uploadingLogo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      className="card p-5"
    >
      <h3 className="section-title text-sm mb-4">{editingId ? 'Editar Equipo' : 'Nuevo Equipo'}</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Nombre *</label>
            <input
              type="text"
              className="input-base"
              placeholder="ej: Real Madrid"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Slug *</label>
            <input
              type="text"
              className="input-base"
              placeholder="ej: real-madrid"
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              required
              disabled={!!editingId}
            />
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Liga</label>
            <select
              className="input-base"
              value={form.league_id}
              onChange={e => setForm(f => ({ ...f, league_id: e.target.value }))}
            >
              <option value="">Sin liga</option>
              {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">País</label>
            <input
              type="text"
              className="input-base"
              placeholder="ej: Spain"
              value={form.country}
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Logo</label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="input-base flex-1"
                onChange={e => onLogoUpload(e.target.files?.[0], setForm)}
                disabled={uploadingLogo}
              />
            </div>
            {form.logo_path && <p className="text-2xs text-text-muted mt-1">✓ {form.logo_path}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button type="submit" className="btn-primary" disabled={uploadingLogo}>{editingId ? 'Actualizar' : 'Crear Equipo'}</button>
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={uploadingLogo}>Cancelar</button>
        </div>
      </form>
    </motion.div>
  )
}

export default function TeamsManager() {
  const [teams, setTeams] = useState([])
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const canEdit = hasEditAccess(user)
  const canDelete = hasDeleteAccess(user)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogoUpload = async (file, setFormFn) => {
    if (!file) return
    setUploadingLogo(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await api.post('/uploads/equipos', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (res.data.status === 'success') {
        setFormFn(f => ({ ...f, logo_path: res.data.data.path }))
        showToast('Logo cargado')
      }
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al cargar logo', 'error')
    } finally {
      setUploadingLogo(false)
    }
  }

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [teamsRes, leaguesRes] = await Promise.all([
        api.get('/teams'),
        api.get('/leagues'),
      ])
      setTeams(teamsRes.data.data.teams)
      setLeagues(leaguesRes.data.data.leagues)
    } catch { showToast('Error al cargar datos', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        league_id: form.league_id ? Number(form.league_id) : null,
        country: form.country || null,
        logo_path: form.logo_path || null,
      }
      if (editingId) {
        await api.put(`/teams/${editingId}`, payload)
        showToast('Equipo actualizado')
      } else {
        await api.post('/teams', payload)
        showToast('Equipo creado')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al guardar', 'error')
    }
  }

  const handleEdit = (team) => {
    setEditingId(team.id)
    setForm({
      name: team.name ?? '',
      slug: team.slug ?? '',
      league_id: team.league_id ?? '',
      country: team.country ?? '',
      logo_path: team.logo_path ?? '',
    })
    setShowForm(true)
  }

  const handleDelete = async (team) => {
    if (!window.confirm(`¿Eliminar el equipo "${team.name}"?`)) return
    try {
      await api.delete(`/teams/${team.id}`)
      showToast('Equipo eliminado')
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al eliminar', 'error')
    }
  }

  const columns = [
    {
      key: 'logo_path', label: 'Logo', sortable: false,
      render: row => (
        <ImageWithFallback
          src={row.logo_path || getTeamLogoPath(row.name)}
          alt={row.name}
          type="team"
          initials={getTeamInitials(row.name)}
          className="w-7 h-7 rounded"
        />
      ),
    },
    { 
      key: 'name', 
      label: 'Nombre', 
      sortable: true,
      render: row => renderNameAsLink(row, 'team', navigate)
    },
    { key: 'slug', label: 'Slug', sortable: false },
    { key: 'country', label: 'País', sortable: true },
    {
      key: 'League', label: 'Liga', sortable: false,
      render: row => (
        <div className="flex items-center gap-1.5">
          <ImageWithFallback
            src={getLeagueLogoPath(row.League?.name)}
            alt={row.League?.name}
            type="league"
            initials={row.League?.name?.charAt(0)}
            className="w-4 h-4 rounded-sm"
          />
          <span>{row.League?.name ?? '—'}</span>
        </div>
      ),
    },
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
          <h2 className="section-title">Equipos</h2>
          <p className="text-2xs text-text-muted mt-0.5">{teams.length} equipo{teams.length !== 1 ? 's' : ''} registrado{teams.length !== 1 ? 's' : ''}</p>
        </div>
        {canEdit && (
          <button onClick={showForm ? () => setShowForm(false) : () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true) }} className="btn-primary">
            {showForm ? 'Cerrar' : '+ Nuevo Equipo'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && canEdit && (
          <ManagerForm
            form={form} setForm={setForm}
            onSubmit={handleSubmit} onCancel={() => setShowForm(false)}
            editingId={editingId} leagues={leagues}
            onLogoUpload={handleLogoUpload} uploadingLogo={uploadingLogo}
          />
        )}
      </AnimatePresence>

      <DataTable
        data={teams}
        columns={columns}
        loading={loading}
        onEdit={canEdit ? handleEdit : null}
        onDelete={canDelete ? handleDelete : null}
        onRowClick={(row) => navigate(getDetailLink('team', row))}
      />
    </div>
  )
}
