import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@services/api'
import { useNavigate } from 'react-router-dom'
import { getDetailLink } from '@utils/linkHelpers'
import { getTeamLogoPath, getTeamInitials } from '@utils/imageUtils'
import DataTable from '@components/ui/DataTable'
import useAuthStore from '@store/authStore'
import { canEdit as hasEditAccess, canDelete as hasDeleteAccess } from '@utils/permissions'
import ImageWithFallback from '@components/common/ImageWithFallback'

const EMPTY_FORM = { home_team_id: '', away_team_id: '', league_id: '', stadium_id: '', match_date: '', status: 'scheduled', home_score: 0, away_score: 0 }

const STATUS_OPTIONS = ['scheduled', 'live', 'finished', 'cancelled']
const STATUS_LABEL = { scheduled: 'Programado', live: 'En Vivo', finished: 'Finalizado', cancelled: 'Cancelado' }
const STATUS_COLOR = {
  live: 'text-accent-red bg-accent-red/10 border-accent-red/20',
  scheduled: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
  finished: 'text-accent-green bg-accent-green/10 border-accent-green/20',
  cancelled: 'text-text-muted bg-bg-tertiary border-border',
}

function ManagerForm({ form, setForm, onSubmit, onCancel, editingId, teams, leagues, stadiums }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      className="card p-5"
    >
      <h3 className="section-title text-sm mb-4">{editingId ? 'Editar Partido' : 'Nuevo Partido'}</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Equipo Local *</label>
            <select
              className="input-base"
              value={form.home_team_id}
              onChange={e => setForm(f => ({ ...f, home_team_id: e.target.value }))}
              required
            >
              <option value="">Seleccionar equipo</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Equipo Visitante *</label>
            <select
              className="input-base"
              value={form.away_team_id}
              onChange={e => setForm(f => ({ ...f, away_team_id: e.target.value }))}
              required
            >
              <option value="">Seleccionar equipo</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
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
            <label className="text-2xs text-text-muted uppercase tracking-wide">Estadio</label>
            <select
              className="input-base"
              value={form.stadium_id}
              onChange={e => setForm(f => ({ ...f, stadium_id: e.target.value }))}
            >
              <option value="">Sin estadio</option>
              {stadiums.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Fecha y hora *</label>
            <input
              type="datetime-local"
              className="input-base"
              value={form.match_date ? form.match_date.slice(0, 16) : ''}
              onChange={e => setForm(f => ({ ...f, match_date: e.target.value }))}
              required={!editingId}
            />
          </div>
          <div className="space-y-1">
            <label className="text-2xs text-text-muted uppercase tracking-wide">Estado</label>
            <select
              className="input-base"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>
          {editingId && (
            <div className="space-y-1 sm:col-span-1">
              <label className="text-2xs text-text-muted uppercase tracking-wide">Marcador (L – V)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  className="input-base text-center"
                  value={form.home_score}
                  onChange={e => setForm(f => ({ ...f, home_score: e.target.value }))}
                />
                <span className="text-text-muted font-bold">–</span>
                <input
                  type="number"
                  min="0"
                  className="input-base text-center"
                  value={form.away_score}
                  onChange={e => setForm(f => ({ ...f, away_score: e.target.value }))}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button type="submit" className="btn-primary">{editingId ? 'Actualizar' : 'Crear Partido'}</button>
          <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </motion.div>
  )
}

export default function MatchesManager() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [leagues, setLeagues] = useState([])
  const [stadiums, setStadiums] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState(null)
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
      const [matchRes, teamRes, leagueRes, stadiumRes] = await Promise.all([
        api.get('/matches'),
        api.get('/teams'),
        api.get('/leagues'),
        api.get('/stadiums'),
      ])
      setMatches(matchRes.data.data.matches)
      setTeams(teamRes.data.data.teams)
      setLeagues(leagueRes.data.data.leagues)
      setStadiums(stadiumRes.data.data?.stadiums || [])
    } catch { showToast('Error al cargar datos', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/matches/${editingId}`, {
          home_score: Number(form.home_score),
          away_score: Number(form.away_score),
          status: form.status,
          match_date: form.match_date || undefined,
          league_id: form.league_id ? Number(form.league_id) : null,
          stadium_id: form.stadium_id ? Number(form.stadium_id) : null,
        })
        showToast('Partido actualizado')
      } else {
        await api.post('/matches', {
          home_team_id: Number(form.home_team_id),
          away_team_id: Number(form.away_team_id),
          league_id: form.league_id ? Number(form.league_id) : null,
          stadium_id: form.stadium_id ? Number(form.stadium_id) : null,
          match_date: form.match_date,
          status: form.status,
        })
        showToast('Partido creado')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al guardar', 'error')
    }
  }

  const handleEdit = (match) => {
    setEditingId(match.id)
    setForm({
      home_team_id: match.home_team_id,
      away_team_id: match.away_team_id,
      league_id: match.league_id ?? '',
      stadium_id: match.stadium_id ?? '',
      match_date: match.match_date ? match.match_date.slice(0, 16) : '',
      status: match.status,
      home_score: match.home_score ?? 0,
      away_score: match.away_score ?? 0,
    })
    setShowForm(true)
  }

  const handleDelete = async (match) => {
    const label = `${match.homeTeam?.name ?? 'Local'} vs ${match.awayTeam?.name ?? 'Visitante'}`
    if (!window.confirm(`¿Eliminar el partido "${label}"?`)) return
    try {
      await api.delete(`/matches/${match.id}`)
      showToast('Partido eliminado')
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message ?? 'Error al eliminar', 'error')
    }
  }

  const columns = [
    {
      key: 'match_date', label: 'Fecha', sortable: true,
      render: row => new Date(row.match_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
    {
      key: 'homeTeam', label: 'Local', sortable: false,
      render: row => (
        <div className="flex items-center gap-2">
          <ImageWithFallback
            src={getTeamLogoPath(row.homeTeam?.name)}
            alt={row.homeTeam?.name}
            type="team"
            initials={getTeamInitials(row.homeTeam?.name)}
            className="w-5 h-5 rounded-sm"
          />
          <span>{row.homeTeam?.name ?? '—'}</span>
        </div>
      ),
    },
    {
      key: 'score', label: 'Marcador', sortable: false,
      render: row => (row.status === 'finished' || row.status === 'live')
        ? <span className="font-bold text-text-primary">{row.home_score} – {row.away_score}</span>
        : <span className="text-text-muted">–</span>,
    },
    {
      key: 'awayTeam', label: 'Visitante', sortable: false,
      render: row => (
        <div className="flex items-center gap-2">
          <span>{row.awayTeam?.name ?? '—'}</span>
          <ImageWithFallback
            src={getTeamLogoPath(row.awayTeam?.name)}
            alt={row.awayTeam?.name}
            type="team"
            initials={getTeamInitials(row.awayTeam?.name)}
            className="w-5 h-5 rounded-sm"
          />
        </div>
      ),
    },
    {
      key: 'status', label: 'Estado', sortable: false,
      render: row => (
        <span className={`badge border text-2xs ${STATUS_COLOR[row.status]}`}>
          {STATUS_LABEL[row.status]}
        </span>
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
          <h2 className="section-title">Partidos</h2>
          <p className="text-2xs text-text-muted mt-0.5">{matches.length} partido{matches.length !== 1 ? 's' : ''} registrado{matches.length !== 1 ? 's' : ''}</p>
        </div>
        {canEdit && (
          <button onClick={showForm ? () => setShowForm(false) : () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true) }} className="btn-primary">
            {showForm ? 'Cerrar' : '+ Nuevo Partido'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && canEdit && (
          <ManagerForm
            form={form} setForm={setForm}
            onSubmit={handleSubmit} onCancel={() => setShowForm(false)}
            editingId={editingId} teams={teams} leagues={leagues} stadiums={stadiums}
          />
        )}
      </AnimatePresence>

      <DataTable
        data={matches}
        columns={columns}
        loading={loading}
        onEdit={canEdit ? handleEdit : null}
        onDelete={canDelete ? handleDelete : null}
        onRowClick={(row) => navigate(getDetailLink('match', row))}
      />
    </div>
  )
}
