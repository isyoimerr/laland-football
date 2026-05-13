import ImageWithFallback from '@components/common/ImageWithFallback'
import { getLeagueLogoPath } from '@utils/imageUtils'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@services/api'
import DataTable from '@components/ui/DataTable'
import useAuthStore from '@store/authStore'
import { canManageLeagues as hasEditAccess, canDelete as hasDeleteAccess } from '@utils/permissions'
import { useNavigate } from 'react-router-dom'
import { renderNameAsLink, getDetailLink } from '@utils/linkHelpers'

const EMPTY_FORM = { name: '', slug: '', country: '', logo_path: '' }

function ManagerForm({ form, setForm, onSubmit, onCancel, editingId, onLogoUpload, uploadingLogo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="card p-5"
    >
      <h3 className="section-title text-sm mb-4">{editingId ? 'Editar Liga' : 'Nueva Liga'}</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Nombre *</label>
            <input
              type="text"
              className="input-base"
              placeholder="ej: La Liga"
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
              placeholder="ej: la-liga"
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              required
              disabled={!!editingId}
            />
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
          <div className="space-y-1">
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
          <button type="submit" className="btn-primary" disabled={uploadingLogo}>
            {editingId ? 'Actualizar' : 'Crear Liga'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={uploadingLogo}>
            Cancelar
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default function LeaguesManager() {
  const navigate = useNavigate()
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const { user } = useAuthStore()
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
      const res = await api.post('/uploads/ligas', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
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

  const fetchLeagues = async () => {
    setLoading(true)
    try {
      const res = await api.get('/leagues')
      setLeagues(res.data.data.leagues)
    } catch { showToast('Error al cargar ligas', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchLeagues() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/leagues/${editingId}`, form)
        showToast('Liga actualizada correctamente')
      } else {
        await api.post('/leagues', form)
        showToast('Liga creada correctamente')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      fetchLeagues()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al guardar', 'error')
    }
  }

  const handleEdit = (league) => {
    setEditingId(league.id)
    setForm({ name: league.name, slug: league.slug, country: league.country ?? '', logo_path: league.logo_path ?? '' })
    setShowForm(true)
  }

  const handleDelete = async (league) => {
    if (!window.confirm(`¿Eliminar la liga "${league.name}"?`)) return
    try {
      await api.delete(`/leagues/${league.id}`)
      showToast('Liga eliminada')
      fetchLeagues()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al eliminar', 'error')
    }
  }

  const handleNew = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const columns = [
    {
      key: 'logo_path', label: 'Logo', sortable: false,
      render: row => (
        <ImageWithFallback
          src={row.logo_path || getLeagueLogoPath(row.name)}
          alt={row.name}
          type="league"
          initials={row.name.charAt(0).toUpperCase()}
          className="w-7 h-7 rounded"
        />
      ),
    },
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: row => renderNameAsLink(row, 'league', navigate),
    },
    { key: 'slug', label: 'Slug', sortable: false },
    { key: 'country', label: 'País', sortable: true },
  ]

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Toast */}
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Ligas</h2>
          <p className="text-2xs text-text-muted mt-0.5">{leagues.length} liga{leagues.length !== 1 ? 's' : ''} registrada{leagues.length !== 1 ? 's' : ''}</p>
        </div>
        {canEdit && (
          <button onClick={showForm ? () => setShowForm(false) : handleNew} className="btn-primary">
            {showForm ? 'Cerrar' : '+ Nueva Liga'}
          </button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && canEdit && (
          <ManagerForm
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            editingId={editingId}
            onLogoUpload={handleLogoUpload}
            uploadingLogo={uploadingLogo}
          />
        )}
      </AnimatePresence>

      {/* Tabla */}
      <DataTable
        data={leagues}
        columns={columns}
        loading={loading}
        onEdit={canEdit ? handleEdit : null}
        onDelete={canDelete ? handleDelete : null}
        onRowClick={(row) => navigate(getDetailLink('league', row))}
      />
    </div>
  )
}
