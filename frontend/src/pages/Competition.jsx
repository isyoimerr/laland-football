import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@services/api'
import { resolveAssetPath } from '@utils/imageUtils'

function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

const STATUS_LABEL = {
  scheduled: 'Programado',
  live: 'EN VIVO',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
}

function MatchCard({ match }) {
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <Link
      to={`/partidos/${match.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-bg-tertiary transition-colors group"
    >
      {/* Equipos y marcador */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {match.homeTeam?.logo_path
            ? <img src={resolveAssetPath(match.homeTeam.logo_path)} alt={match.homeTeam.name} className="w-4 h-4 object-contain" />
            : <div className="w-4 h-4 rounded-full bg-bg-tertiary border border-border" />
          }
          <span className={`text-xs font-semibold ${isFinished && match.home_score > match.away_score ? 'text-text-primary' : 'text-text-secondary'}`}>
            {match.homeTeam?.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {match.awayTeam?.logo_path
            ? <img src={resolveAssetPath(match.awayTeam.logo_path)} alt={match.awayTeam.name} className="w-4 h-4 object-contain" />
            : <div className="w-4 h-4 rounded-full bg-bg-tertiary border border-border" />
          }
          <span className={`text-xs font-semibold ${isFinished && match.away_score > match.home_score ? 'text-text-primary' : 'text-text-secondary'}`}>
            {match.awayTeam?.name}
          </span>
        </div>
      </div>

      {/* Marcador / Fecha */}
      <div className="flex flex-col items-center gap-1 min-w-[52px]">
        {isFinished || isLive ? (
          <>
            <span className={`text-xs font-black ${isLive ? 'text-accent-red' : 'text-text-primary'}`}>
              {match.home_score}
            </span>
            <span className={`text-xs font-black ${isLive ? 'text-accent-red' : 'text-text-primary'}`}>
              {match.away_score}
            </span>
          </>
        ) : (
          <span className="text-2xs text-text-muted text-center">
            {new Date(match.match_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      {/* Estado */}
      <div className="w-20 text-right">
        {isLive ? (
          <span className="badge badge-live text-2xs">EN VIVO</span>
        ) : (
          <span className="text-2xs text-text-muted">{STATUS_LABEL[match.status]}</span>
        )}
      </div>
    </Link>
  )
}

export default function Competition() {
  const { id } = useParams()
  const [league, setLeague] = useState(null)
  const [standings, setStandings] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('standings')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/leagues/${id}`),
      api.get(`/leagues/${id}/standings`),
      api.get(`/matches?league_id=${id}`),
    ])
      .then(([leagueRes, standRes, matchRes]) => {
        setLeague(leagueRes.data.data.league)
        setStandings(standRes.data.data.standings)
        setMatches(matchRes.data.data.matches)
      })
      .catch(() => setError('No se pudo cargar la competición'))
      .finally(() => setLoading(false))
  }, [id])

  if (error) {
    return <div className="card p-8 text-center text-text-muted">{error}</div>
  }

  const liveMatches = matches.filter(m => m.status === 'live')
  const upcomingMatches = matches.filter(m => m.status === 'scheduled').slice(0, 8)
  const finishedMatches = matches.filter(m => m.status === 'finished').slice(0, 8)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl mx-auto px-4 py-6 space-y-4"
    >
      {/* Header */}
      <div className="card p-5 flex items-center gap-4">
        {loading ? (
          <>
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-bg-tertiary border border-border flex items-center justify-center flex-shrink-0">
              {league?.logo_path
                ? <img src={resolveAssetPath(league.logo_path)} alt={league.name} className="w-12 h-12 object-contain" />
                : <span className="text-2xl font-black text-text-muted">{league?.name?.[0]}</span>
              }
            </div>
            <div>
              <h1 className="text-xl font-black text-text-primary">{league?.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                {league?.country && <span className="text-xs text-text-muted">{league.country}</span>}
                {league?.Teams && (
                  <span className="badge badge-green">{league.Teams.length} equipos</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* En vivo */}
      {!loading && liveMatches.length > 0 && (
        <div className="card overflow-hidden border-accent-red/30">
          <div className="px-4 py-2 border-b border-border flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
            <span className="text-xs font-semibold text-accent-red">En Vivo</span>
          </div>
          <div className="divide-y divide-border">
            {liveMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {[['standings', 'Clasificación'], ['fixture', 'Próximos'], ['results', 'Resultados']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-xs font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === key
                ? 'border-accent-green text-accent-green'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Clasificación */}
      {activeTab === 'standings' && (
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-2">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : standings.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-xs">Sin datos de clasificación.</div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-3 text-left text-text-muted font-medium w-8">#</th>
                  <th className="px-3 py-3 text-left text-text-muted font-medium">Equipo</th>
                  <th className="px-3 py-3 text-center text-text-muted font-medium w-10">PJ</th>
                  <th className="px-3 py-3 text-center text-text-muted font-medium w-10">GF</th>
                  <th className="px-3 py-3 text-center text-text-muted font-medium w-10">GC</th>
                  <th className="px-3 py-3 text-center text-text-muted font-medium w-10">DG</th>
                  <th className="px-3 py-3 text-center text-accent-green font-bold w-10">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {standings.map((row, i) => {
                  const gd = (Number(row.goals_for) || 0) - (Number(row.goals_against) || 0)
                  return (
                    <tr key={row.id} className="hover:bg-bg-tertiary/30 transition-colors">
                      <td className="px-3 py-3 text-text-muted font-semibold">{i + 1}</td>
                      <td className="px-3 py-3">
                        <Link
                          to={`/equipos/${row.id}`}
                          className="flex items-center gap-2 font-semibold text-text-primary hover:text-accent-green transition-colors"
                        >
                          {row.logo_path && (
                            <img src={resolveAssetPath(row.logo_path)} alt={row.name} className="w-5 h-5 object-contain" />
                          )}
                          {row.name}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-center text-text-secondary">{row.played ?? 0}</td>
                      <td className="px-3 py-3 text-center text-text-secondary">{row.goals_for ?? 0}</td>
                      <td className="px-3 py-3 text-center text-text-secondary">{row.goals_against ?? 0}</td>
                      <td className={`px-3 py-3 text-center font-semibold ${gd > 0 ? 'text-accent-green' : gd < 0 ? 'text-accent-red' : 'text-text-muted'}`}>
                        {gd > 0 ? `+${gd}` : gd}
                      </td>
                      <td className="px-3 py-3 text-center font-black text-accent-green">{row.points ?? 0}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Próximos */}
      {activeTab === 'fixture' && (
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : upcomingMatches.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-xs">Sin partidos programados.</div>
          ) : (
            <div className="divide-y divide-border">
              {upcomingMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          )}
        </div>
      )}

      {/* Resultados */}
      {activeTab === 'results' && (
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : finishedMatches.length === 0 ? (
            <div className="p-8 text-center text-text-muted text-xs">Sin resultados registrados.</div>
          ) : (
            <div className="divide-y divide-border">
              {finishedMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
