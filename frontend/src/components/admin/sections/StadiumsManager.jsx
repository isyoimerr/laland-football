import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@services/api'
import DataTable from '@components/ui/DataTable'
import useAuthStore from '@store/authStore'
import { canEdit as hasEditAccess, canDelete as hasDeleteAccess } from '@utils/permissions'
import { useNavigate } from 'react-router-dom'
import { renderNameAsLink, getDetailLink } from '@utils/linkHelpers'
import { getStadiumPhotoPath } from '@utils/imageUtils'
import ImageWithFallback from '@components/common/ImageWithFallback'

const EMPTY_FORM = { name: '', city: '', capacity: '', country: '', image_path: '' }

function ManagerForm({ form, setForm, onSubmit, onCancel, editingId, onPhotoUpload, uploadingPhoto }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      className="card p-5"
    >
      <h3 className="section-title text-sm mb-4">{editingId ? 'Editar Estadio' : 'Nuevo Estadio'}</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Nombre *</label>
            <input
              type="text"
              className="input-base"
              placeholder="ej: Santiago Bernabéu"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Ciudad *</label>
            <input
              type="text"
              className="input-base"
              placeholder="ej: Madrid"
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Capacidad</label>
            <input
              type="number"
              className="input-base"
              placeholder="ej: 81044"
              value={form.capacity}
              onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
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
            {form.image_path && <p className="text-2xs text-text-muted mt-1">✓ {form.image_path}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button type="submit" className="btn-primary">{editingId ? 'Actualizar' : 'Crear Estadio'}</button>
          <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </motion.div>
  )
}

export default function StadiumsManager() {
  const [stadiums, setStadiums] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const res = await api.get('/stadiums')
      setStadiums(res.data.data?.stadiums || [])
      setToast(null)
    } catch (err) {
      setToast(err.response?.data?.message ?? 'Error al cargar', 'error')
    } finally {
      setLoading(false)
    }
  }

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
      const res = await api.post('/uploads/estadios', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (res.data.status === 'success') {
        setFormFn(f => ({ ...f, image_path: res.data.data.path }))
        showToast('Foto cargada')
      }
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al cargar foto', 'error')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: form.name,
        city: form.city,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        country: form.country,
        image_path: form.image_path || null,
      }
      if (editingId) {
        await api.put(`/stadiums/${editingId}`, payload)
        showToast('Estadio actualizado')
      } else {
        await api.post('/stadiums', payload)
        showToast('Estadio creado')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al guardar', 'error')
    }
  }

  const handleEdit = (stadium) => {
    setEditingId(stadium.id)
    setForm({
      name: stadium.name ?? '',
      city: stadium.city ?? '',
      capacity: stadium.capacity ?? '',
      country: stadium.country ?? '',
      image_path: stadium.image_path ?? '',
    })
    setShowForm(true)
  }

  const handleDelete = async (stadium) => {
    if (!window.confirm(`¿Eliminar el estadio "${stadium.name}"?`)) return
    try {
      await api.delete(`/stadiums/${stadium.id}`)
      showToast('Estadio eliminado')
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al eliminar', 'error')
    }
  }

  const columns = [
    {
      key: 'image_path', label: 'Foto', sortable: false,
      render: row => (
        <ImageWithFallback
          src={row.image_path || getStadiumPhotoPath(row.name)}
          alt={row.name}
          type="stadium"
          className="w-8 h-8 rounded object-cover"
        />
      ),
    },
    { 
      key: 'name', 
      label: 'Nombre', 
      sortable: true,
      render: row => renderNameAsLink(row, 'stadium', navigate)
    },
    { key: 'city', label: 'Ciudad', sortable: true },
    { 
      key: 'capacity', 
      label: 'Capacidad', 
      sortable: true,
      render: row => row.capacity ? row.capacity.toLocaleString('es-ES') : '—'
    },
    { key: 'country', label: 'País', sortable: true },
  ]

  return (
    <div className="space-y-4 max-w-5xl">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-xs font-semibold shadow-card ${
              toast.type === 'error' ? 'bg-red-900 text-red-100' : 'bg-green-900 text-green-100'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && hasEditAccess(user) && (
          <ManagerForm
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingId(null)
              setForm(EMPTY_FORM)
            }}
            editingId={editingId}
            onPhotoUpload={handlePhotoUpload}
            uploadingPhoto={uploadingPhoto}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">Estadios</h2>
          <p className="text-2xs text-text-muted mt-0.5">{stadiums.length} estadio{stadiums.length !== 1 ? 's' : ''} registrado{stadiums.length !== 1 ? 's' : ''}</p>
        </div>
        {hasEditAccess(user) && (
          <button onClick={showForm ? () => setShowForm(false) : () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true) }} className="btn-primary">
            {showForm ? 'Cerrar' : '+ Nuevo Estadio'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">Cargando...</div>
      ) : stadiums.length === 0 ? (
        <div className="text-center py-12 text-text-muted">No hay estadios registrados</div>
      ) : (
        <DataTable
          columns={columns}
          data={stadiums}
          onEdit={hasEditAccess(user) ? handleEdit : null}
          onDelete={hasDeleteAccess(user) ? handleDelete : null}
          rowsPerPage={10}
          onRowClick={(row) => navigate(getDetailLink('stadium', row))}
        />
      )}
    </div>
  )
}
