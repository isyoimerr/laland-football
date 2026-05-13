import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '@services/api'
import useAuthStore from '@store/authStore'
import { canEdit as hasEditAccess } from '@utils/permissions'

function KPICard({ label, value, color, icon, delay = 0 }) {
  return (
    <motion.div
      className="card p-5 flex items-center gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`} style={{ background: `${color}18` }}>
        {icon}
      </div>
      <div>
        <p className="text-2xs text-text-muted uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-black text-text-primary">{value}</p>
      </div>
    </motion.div>
  )
}

function QuickAction({ label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 border"
      style={{ borderColor: `${color}33`, background: `${color}0d`, color }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}20` }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}0d` }}
    >
      {label}
    </button>
  )
}

export default function Dashboard({ setActive }) {
  const [stats, setStats] = useState({ teams: 0, players: 0, matches: 0, leagues: 0 })
  const [recentMatches, setRecentMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  const canEdit = hasEditAccess(user)

  useEffect(() => {
    Promise.all([
      api.get('/teams'),
      api.get('/players'),
      api.get('/matches'),
      api.get('/leagues'),
    ])
      .then(([teams, players, matches, leagues]) => {
        setStats({
          teams: teams.data.data.teams.length,
          players: players.data.data.players.length,
          matches: matches.data.data.matches.length,
          leagues: leagues.data.data.leagues.length,
        })
        setRecentMatches(matches.data.data.matches.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const STATUS_COLOR = {
    live: '#ef4444',
    scheduled: '#3b82f6',
    finished: '#00d4a1',
    cancelled: '#4b5563',
  }
  const STATUS_LABEL = { live: 'EN VIVO', scheduled: 'Programado', finished: 'Finalizado', cancelled: 'Cancelado' }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Bienvenida */}
      <div>
        <h1 className="text-lg font-black text-text-primary">
          Bienvenido, <span className="text-gradient">{user?.name}</span>
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-lg" />)
        ) : (
          <>
            <KPICard label="Equipos" value={stats.teams} color="#3b82f6" icon="⚽" delay={0} />
            <KPICard label="Jugadores" value={stats.players} color="#00d4a1" icon="👕" delay={0.05} />
            <KPICard label="Partidos" value={stats.matches} color="#a855f7" icon="📅" delay={0.1} />
            <KPICard label="Ligas" value={stats.leagues} color="#f59e0b" icon="🏆" delay={0.15} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Partidos recientes */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="section-title text-sm">Partidos recientes</h2>
            <button onClick={() => setActive?.('matches')} className="text-2xs text-accent-green hover:underline">
              Ver todos →
            </button>
          </div>
          {loading ? (
            <div className="p-4 space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10" />)}</div>
          ) : recentMatches.length === 0 ? (
            <div className="p-6 text-center text-text-muted text-xs">Sin partidos.</div>
          ) : (
            <div className="divide-y divide-border">
              {recentMatches.map(m => (
                <Link
                  key={m.id}
                  to={`/partidos/${m.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-bg-tertiary transition-colors group"
                >
                  <span
                    className="badge text-2xs border"
                    style={{ color: STATUS_COLOR[m.status], background: `${STATUS_COLOR[m.status]}15`, borderColor: `${STATUS_COLOR[m.status]}30` }}
                  >
                    {STATUS_LABEL[m.status]}
                  </span>
                  <span className="flex-1 text-xs text-text-secondary group-hover:text-text-primary transition-colors truncate">
                    {m.homeTeam?.name} vs {m.awayTeam?.name}
                  </span>
                  {m.status === 'finished' || m.status === 'live' ? (
                    <span className="text-xs font-bold text-text-primary">{m.home_score} – {m.away_score}</span>
                  ) : (
                    <span className="text-2xs text-text-muted">
                      {new Date(m.match_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        {canEdit && (
          <div className="card p-5 space-y-4">
            <h2 className="section-title text-sm">Acciones rápidas</h2>
            <div className="flex flex-col gap-2">
              <QuickAction label="+ Nuevo Equipo" onClick={() => setActive?.('teams')} color="#3b82f6" />
              <QuickAction label="+ Nuevo Jugador" onClick={() => setActive?.('players')} color="#00d4a1" />
              <QuickAction label="+ Nuevo Partido" onClick={() => setActive?.('matches')} color="#a855f7" />
              <QuickAction label="+ Nueva Liga" onClick={() => setActive?.('leagues')} color="#f59e0b" />
            </div>
          </div>
        )}

        {!canEdit && (
          <div className="card p-5">
            <h2 className="section-title text-sm mb-3">Mi cuenta</h2>
            <div className="space-y-2 text-xs text-text-secondary">
              <p><span className="text-text-muted">Rol:</span> Usuario</p>
              <p><span className="text-text-muted">Acceso:</span> Solo lectura</p>
            </div>
            <p className="text-2xs text-text-muted mt-4 leading-relaxed">
              Tenés acceso de lectura a todos los módulos. Contactá al administrador para más permisos.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
