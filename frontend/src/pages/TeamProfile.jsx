import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@services/api'
import ImageWithFallback from '@components/common/ImageWithFallback'
import Breadcrumbs from '@components/common/Breadcrumbs'

export default function TeamProfile() {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [matches, setMatches] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [teamRes, matchesRes] = await Promise.all([
          api.get(`/teams/${id}`),
          api.get(`/matches?team_id=${id}`)
        ])

        setTeam(teamRes.data.data?.team || teamRes.data.team)

        const teamMatches = matchesRes.data.data?.matches || matchesRes.data.matches || []
        setMatches(teamMatches.slice(0, 10))

        // Calcular estadísticas
        const calcStats = {
          played: teamMatches.length,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
        }

        teamMatches.forEach(m => {
          const isHome = m.home_team_id === parseInt(id)
          const teamScore = isHome ? m.home_score : m.away_score
          const oppScore = isHome ? m.away_score : m.home_score

          calcStats.goalsFor += teamScore
          calcStats.goalsAgainst += oppScore

          if (teamScore > oppScore) calcStats.wins++
          else if (teamScore === oppScore) calcStats.draws++
          else calcStats.losses++
        })

        setStats(calcStats)
      } catch (err) {
        console.error('Error fetching team data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div className="container max-w-5xl mx-auto px-4 py-6 space-y-4">
      {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
    </div>
  }

  if (!team) {
    return <div className="container max-w-5xl mx-auto px-4 py-6 text-center text-text-muted">
      Equipo no encontrado
    </div>
  }

  return (
    <motion.div
      className="container max-w-5xl mx-auto px-4 py-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumbs items={[{ label: 'Equipos', href: '/equipos' }, { label: team.name }]} />

      {/* Header */}
      <div className="card p-6 space-y-4">
        <div className="flex items-start gap-6">
          <ImageWithFallback
            src={team.logo_path}
            alt={team.name}
            type="team"
            initials={team.name.split(' ').map(w => w[0]).join('')}
            className="w-24 h-24"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-black text-text-primary">{team.name}</h1>
            <p className="text-text-muted text-sm">{team.country}</p>
            {team.League && (
              <Link to={`/competiciones/${team.League.id}`} className="text-accent-teal hover:text-accent-teal-light text-sm mt-2 transition">
                {team.League.name}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-blue">{stats.played}</div>
            <div className="text-2xs text-text-muted mt-1">Partidos</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-green">{stats.wins}</div>
            <div className="text-2xs text-text-muted mt-1">Victorias</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-yellow">{stats.draws}</div>
            <div className="text-2xs text-text-muted mt-1">Empates</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-red">{stats.losses}</div>
            <div className="text-2xs text-text-muted mt-1">Derrotas</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-green">{stats.goalsFor}</div>
            <div className="text-2xs text-text-muted mt-1">GF</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-red">{stats.goalsAgainst}</div>
            <div className="text-2xs text-text-muted mt-1">GC</div>
          </div>
        </div>
      )}

      {/* Jugadores */}
      {team.Players && team.Players.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="section-title text-sm">Plantilla ({team.Players.length})</h2>
          </div>
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {team.Players.map(player => (
              <Link
                key={player.id}
                to={`/jugadores/${player.id}`}
                className="flex items-center justify-between p-4 hover:bg-bg-tertiary/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-2xs font-bold text-text-secondary">
                    {player.number}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary group-hover:text-accent-teal transition">
                      {player.name}
                    </div>
                    <div className="text-2xs text-text-muted">{player.position}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Últimos partidos */}
      {matches.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="section-title text-sm">Últimos Partidos</h2>
          </div>
          <div className="divide-y divide-border">
            {matches.map(match => {
              const isHome = match.home_team_id === team.id
              const opponent = isHome ? match.awayTeam : match.homeTeam
              const teamScore = isHome ? match.home_score : match.away_score
              const oppScore = isHome ? match.away_score : match.home_score
              const result = teamScore > oppScore ? 'win' : teamScore < oppScore ? 'loss' : 'draw'

              return (
                <Link
                  key={match.id}
                  to={`/partidos/${match.id}`}
                  className="flex items-center justify-between p-4 hover:bg-bg-tertiary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-2xs font-bold px-2 py-1 rounded ${
                      result === 'win' ? 'bg-accent-green/10 text-accent-green' :
                      result === 'loss' ? 'bg-accent-red/10 text-accent-red' :
                      'bg-accent-yellow/10 text-accent-yellow'
                    }`}>
                      {result === 'win' ? 'V' : result === 'loss' ? 'D' : 'E'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">
                        {opponent?.name}
                      </div>
                      <div className="text-2xs text-text-muted">
                        {new Date(match.match_date).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-black text-text-primary">
                    {teamScore}–{oppScore}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}
