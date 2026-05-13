import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@services/api'
import ImageWithFallback from '@components/common/ImageWithFallback'
import Breadcrumbs from '@components/common/Breadcrumbs'

export default function PlayerProfile() {
  const { id } = useParams()
  const [player, setPlayer] = useState(null)
  const [team, setTeam] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const playerRes = await api.get(`/players/${id}`)
        const playerData = playerRes.data.data?.player || playerRes.data.player

        setPlayer(playerData)

        if (playerData?.team_id) {
          const teamRes = await api.get(`/teams/${playerData.team_id}`)
          setTeam(teamRes.data.data?.team || teamRes.data.team)
        }

        const statsRes = await api.get(`/players/${id}/stats`).catch(() => null)
        const statsData = statsRes?.data?.data?.stats || { goals: 0, yellow_cards: 0, red_cards: 0, appearances: 0 }
        setStats({
          goals: statsData.goals || 0,
          yellowCards: statsData.yellow_cards || 0,
          redCards: statsData.red_cards || 0,
          appearances: statsData.appearances || 0,
          assists: statsData.assists || 0,
        })
      } catch (err) {
        console.error('Error fetching player data:', err)
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

  if (!player) {
    return <div className="container max-w-5xl mx-auto px-4 py-6 text-center text-text-muted">
      Jugador no encontrado
    </div>
  }

  return (
    <motion.div
      className="container max-w-5xl mx-auto px-4 py-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Breadcrumbs items={[
        { label: 'Equipos', href: '/equipos' },
        ...(team ? [{ label: team.name, href: `/equipos/${team.id}` }] : []),
        { label: player.name }
      ]} />

      {/* Header */}
      <div className="card p-6 space-y-4">
        <div className="flex items-start gap-6">
          <ImageWithFallback
            src={player.photo_path}
            alt={player.name}
            type="player"
            className="w-24 h-24 rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-black text-text-primary">{player.name}</h1>
            <p className="text-text-muted text-sm mt-1">
              <span className="inline-block px-2.5 py-1 rounded bg-accent-blue/10 text-accent-blue text-2xs font-semibold">
                {player.position}
              </span>
            </p>
            {team && (
              <Link to={`/equipos/${team.id}`} className="text-accent-teal hover:text-accent-teal-light text-sm mt-3 transition block">
                🏆 {team.name}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-green">{stats.appearances}</div>
            <div className="text-2xs text-text-muted mt-1">Partidos</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-green">{stats.goals}</div>
            <div className="text-2xs text-text-muted mt-1">Goles</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-yellow">{stats.yellowCards}</div>
            <div className="text-2xs text-text-muted mt-1">Amarillas</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-red">{stats.redCards}</div>
            <div className="text-2xs text-text-muted mt-1">Rojas</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-accent-teal">{stats.assists}</div>
            <div className="text-2xs text-text-muted mt-1">Asistencias</div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="card p-5 space-y-3">
        <h2 className="section-title text-sm">Información</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {player.number && (
            <div>
              <span className="text-text-muted text-2xs">Número de Camiseta</span>
              <p className="text-text-primary font-semibold">{player.number}</p>
            </div>
          )}
          <div>
            <span className="text-text-muted text-2xs">Posición</span>
            <p className="text-text-primary font-semibold">{player.position}</p>
          </div>
          {player.nationality && (
            <div>
              <span className="text-text-muted text-2xs">Nacionalidad</span>
              <p className="text-text-primary font-semibold">{player.nationality}</p>
            </div>
          )}
          {player.height && (
            <div>
              <span className="text-text-muted text-2xs">Altura</span>
              <p className="text-text-primary font-semibold">{player.height} cm</p>
            </div>
          )}
          {player.weight && (
            <div>
              <span className="text-text-muted text-2xs">Peso</span>
              <p className="text-text-primary font-semibold">{player.weight} kg</p>
            </div>
          )}
          {team && (
            <div>
              <span className="text-text-muted text-2xs">Equipo</span>
              <Link to={`/equipos/${team.id}`} className="text-text-primary font-semibold hover:text-accent-teal transition">
                {team.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
