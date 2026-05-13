import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@services/api'
import { resolveAssetPath } from '@utils/imageUtils'
import VideoPlayer from '@components/common/VideoPlayer'
import { playGoal, playWhistle } from '@utils/soundUtils'

const STATUS_LABEL = {
  scheduled: 'Programado',
  live: 'En Vivo',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
}

const STATUS_COLOR = {
  scheduled: 'text-text-secondary',
  live: 'text-accent-red',
  finished: 'text-accent-green',
  cancelled: 'text-text-muted',
}

function EventIcon({ type }) {
  switch (type) {
    case 'goal':
      return (
        <span className="inline-flex w-5 h-5 rounded-full border-2 border-accent-green/60 bg-accent-green/10 items-center justify-center flex-shrink-0">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00d4a1" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="4" fill="#00d4a1" stroke="none"/></svg>
        </span>
      )
    case 'yellow_card':
      return <span className="inline-block w-3.5 h-4.5 rounded-sm flex-shrink-0" style={{ background: '#f59e0b', minWidth: '0.875rem', minHeight: '1.125rem', borderRadius: '2px' }} />
    case 'red_card':
      return <span className="inline-block w-3.5 h-4.5 rounded-sm flex-shrink-0" style={{ background: '#ef4444', minWidth: '0.875rem', minHeight: '1.125rem', borderRadius: '2px' }} />
    case 'substitution':
      return (
        <span className="inline-flex w-5 h-5 items-center justify-center flex-shrink-0 text-accent-blue">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/></svg>
        </span>
      )
    case 'injury':
      return (
        <span className="inline-flex w-5 h-5 rounded-full bg-accent-red/10 items-center justify-center flex-shrink-0 text-accent-red">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </span>
      )
    default:
      return <span className="inline-block w-4 h-4 rounded-full bg-bg-tertiary flex-shrink-0" />
  }
}

const EVENT_LABEL = {
  goal: 'Gol',
  yellow_card: 'Tarjeta Amarilla',
  red_card: 'Tarjeta Roja',
  substitution: 'Sustitución',
  injury: 'Lesión',
}

function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

function EventRow({ event, homeTeamId }) {
  const isHome = event.team_id === homeTeamId
  const evType = event.eventType ?? event.type
  return (
    <div className={`flex items-center gap-3 py-2.5 px-4 ${isHome ? 'flex-row' : 'flex-row-reverse'}`}>
      <EventIcon type={evType} />
      <div className={`flex flex-col ${isHome ? 'items-start' : 'items-end'} flex-1 min-w-0`}>
        <span className="text-xs font-semibold text-text-primary truncate">
          {event.Player?.name ?? 'Jugador'}
        </span>
        {event.description && (
          <span className="text-2xs text-text-muted truncate">{event.description}</span>
        )}
        <span className="text-2xs text-text-muted">{EVENT_LABEL[evType]}</span>
      </div>
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-6 rounded bg-bg-tertiary border border-border">
        <span className="text-2xs font-bold text-accent-green">{event.minute}'</span>
      </div>
    </div>
  )
}

function StatBar({ label, home, away }) {
  const total = (Number(home) || 0) + (Number(away) || 0)
  const homePct = total === 0 ? 50 : Math.round(((Number(home) || 0) / total) * 100)
  const awayPct = 100 - homePct
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-text-secondary">
        <span className="font-semibold text-text-primary">{home}</span>
        <span className="text-text-muted">{label}</span>
        <span className="font-semibold text-text-primary">{away}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-bg-tertiary">
        <div className="bg-accent-blue rounded-l-full transition-all" style={{ width: `${homePct}%` }} />
        <div className="bg-accent-green rounded-r-full transition-all" style={{ width: `${awayPct}%` }} />
      </div>
    </div>
  )
}

export default function MatchDetail() {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/matches/${id}`),
      api.get(`/match-videos?match_id=${id}`),
    ])
      .then(([matchRes, videoRes]) => {
        const matchData = matchRes.data.data.match
        setMatch(matchData)
        setVideos(videoRes.data.data.videos || [])
        if (videoRes.data.data.videos?.length > 0) { setSelectedVideo(videoRes.data.data.videos[0]) }
        if (matchData?.MatchEvents?.some(e => (e.eventType ?? e.type) === 'goal')) {
          setTimeout(() => playGoal(), 500)
        }
        if (matchData?.status === 'finished') {
          setTimeout(() => playWhistle(), 1500)
        }
      })
      .catch(() => setError('No se pudo cargar el partido'))
      .finally(() => setLoading(false))
  }, [id])

  if (error) {
    return (
      <div className="card p-8 text-center text-text-muted">{error}</div>
    )
  }

  const homeEvents = match?.MatchEvents?.filter(e => e.team_id === match.home_team_id) ?? []
  const awayEvents = match?.MatchEvents?.filter(e => e.team_id === match.away_team_id) ?? []
  const evType = e => e.eventType ?? e.type
  const homeGoals = homeEvents.filter(e => evType(e) === 'goal').length
  const awayGoals = awayEvents.filter(e => evType(e) === 'goal').length
  const homeYellow = homeEvents.filter(e => evType(e) === 'yellow_card').length
  const awayYellow = awayEvents.filter(e => evType(e) === 'yellow_card').length
  const homeRed = homeEvents.filter(e => evType(e) === 'red_card').length
  const awayRed = awayEvents.filter(e => evType(e) === 'red_card').length
  const allEvents = [...(match?.MatchEvents ?? [])].sort((a, b) => a.minute - b.minute)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl mx-auto px-4 py-6 space-y-4"
    >
      {/* Header del partido */}
      <div className="card p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 mx-auto" />
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
          </div>
        ) : (
          <>
            {/* Liga + estado */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {match.League?.logo_path && (
                  <img src={resolveAssetPath(match.League.logo_path)} alt={match.League.name} className="h-5 w-5 object-contain" />
                )}
                <Link
                  to={`/competiciones/${match.league_id}`}
                  className="text-xs text-text-muted hover:text-accent-green transition-colors"
                >
                  {match.League?.name ?? 'Liga'}
                </Link>
              </div>
              <span className={`text-xs font-semibold ${STATUS_COLOR[match.status]}`}>
                {match.status === 'live' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse mr-1.5" />}
                {STATUS_LABEL[match.status]}
              </span>
            </div>

            {/* Equipos + marcador */}
            <div className="flex items-center justify-between gap-4">
              {/* Local */}
              <Link to={`/equipos/${match.home_team_id}`} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-16 h-16 rounded-full bg-bg-tertiary border border-border flex items-center justify-center overflow-hidden group-hover:border-border-light transition-colors">
                  {match.homeTeam?.logo_path
                    ? <img src={resolveAssetPath(match.homeTeam.logo_path)} alt={match.homeTeam.name} className="w-12 h-12 object-contain" />
                    : <span className="text-xl font-bold text-text-muted">{match.homeTeam?.name?.[0]}</span>
                  }
                </div>
                <span className="text-sm font-semibold text-text-primary text-center leading-tight">
                  {match.homeTeam?.name}
                </span>
              </Link>

              {/* Marcador */}
              <div className="flex flex-col items-center gap-1">
                <div className="text-3xl font-black text-text-primary tracking-tight">
                  {match.home_score} <span className="text-text-muted">–</span> {match.away_score}
                </div>
                <span className="text-2xs text-text-muted">
                  {new Date(match.match_date).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
                {match.Stadium && (
                  <span className="text-2xs text-text-muted">{match.Stadium.name}, {match.Stadium.city}</span>
                )}
                {match.attendance && (
                  <span className="text-2xs text-text-muted">{match.attendance.toLocaleString()} espectadores</span>
                )}
              </div>

              {/* Visitante */}
              <Link to={`/equipos/${match.away_team_id}`} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="w-16 h-16 rounded-full bg-bg-tertiary border border-border flex items-center justify-center overflow-hidden group-hover:border-border-light transition-colors">
                  {match.awayTeam?.logo_path
                    ? <img src={resolveAssetPath(match.awayTeam.logo_path)} alt={match.awayTeam.name} className="w-12 h-12 object-contain" />
                    : <span className="text-xl font-bold text-text-muted">{match.awayTeam?.name?.[0]}</span>
                  }
                </div>
                <span className="text-sm font-semibold text-text-primary text-center leading-tight">
                  {match.awayTeam?.name}
                </span>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Estadísticas */}
      {!loading && match && (
        <div className="card p-5 space-y-4">
          <h2 className="section-title text-sm">Estadísticas</h2>
          <StatBar label="Goles" home={homeGoals} away={awayGoals} />
          <StatBar label="Tarjetas Amarillas" home={homeYellow} away={awayYellow} />
          <StatBar label="Tarjetas Rojas" home={homeRed} away={awayRed} />
          <StatBar label="Eventos Totales" home={homeEvents.length} away={awayEvents.length} />
        </div>
      )}

      {/* Videos del partido */}
      {!loading && (
        <div className="card p-5 space-y-4">
          <h2 className="section-title text-sm">Videos</h2>

          {videos.length === 0 && (
            <div className="space-y-3">
              <video className="w-full aspect-video rounded-lg object-cover" controls playsInline poster="/assets/VIDEOS/Goles/Cristiano_Ronaldo_Goals_2020-2021.mp4">
                <source src="/assets/VIDEOS/Goles/Cristiano_Ronaldo_Goals_2020-2021.mp4" type="video/mp4" />
                <source src="/assets/VIDEOS/Highlights/Tottenham_vs_Liverpool_UCL_Final.mp4" type="video/mp4" />
              </video>
              <p className="text-2xs text-text-muted text-center">Highlights disponibles próximamente</p>
            </div>
          )}

          {selectedVideo && (
            <div className="space-y-3">
              <VideoPlayer
                src={selectedVideo.video_path}
                poster={selectedVideo.thumbnail_path}
                title={selectedVideo.title}
              />
              <div>
                <p className="text-xs font-semibold text-text-primary">{selectedVideo.title}</p>
                {selectedVideo.description && (
                  <p className="text-2xs text-text-muted mt-0.5">{selectedVideo.description}</p>
                )}
              </div>
              {selectedVideo.players?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedVideo.players.map(vp => (
                    <Link
                      key={vp.id}
                      to={`/jugadores/${vp.player_id}`}
                      className="text-2xs bg-bg-tertiary hover:bg-border-light px-2 py-1 rounded text-text-primary transition flex items-center gap-1"
                    >
                      {vp.Player?.photo_path ? (
                        <img src={vp.Player.photo_path} alt="" className="w-4 h-4 rounded-full object-cover" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-accent-green/20 flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#00d4a1" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0 1 12 0v1"/></svg>
                        </span>
                      )}
                      {vp.Player?.name ?? `#${vp.player_id}`}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {videos.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {videos.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVideo(v)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition ${
                    selectedVideo?.id === v.id ? 'border-accent-green' : 'border-transparent hover:border-border-light'
                  }`}
                >
                  {v.thumbnail_path ? (
                    <img src={v.thumbnail_path} alt={v.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-bg-tertiary flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-text-muted"><polygon points="8,5 19,12 8,19" fill="currentColor" /></svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-accent-green/80 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19" /></svg>
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-2xs px-1 py-0.5 rounded font-mono">
                    {v.duration ? `${Math.floor(v.duration / 60)}:${String(v.duration % 60).padStart(2, '0')}` : ''}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Timeline de eventos */}
      {!loading && allEvents.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="section-title text-sm">Eventos del partido</h2>
            <div className="flex items-center gap-4 text-2xs text-text-muted">
              <span className="text-accent-blue">{match.homeTeam?.name}</span>
              <span className="text-accent-green">{match.awayTeam?.name}</span>
            </div>
          </div>
          <div className="divide-y divide-border">
            {allEvents.map(event => (
              <EventRow key={event.id} event={event} homeTeamId={match.home_team_id} />
            ))}
          </div>
        </div>
      )}

      {!loading && allEvents.length === 0 && match && (
        <div className="card p-6 text-center text-text-muted text-xs">
          No hay eventos registrados para este partido.
        </div>
      )}
    </motion.div>
  )
}
