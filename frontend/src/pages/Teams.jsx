import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@services/api'
import { resolveAssetPath } from '@utils/imageUtils'

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/teams')
      .then(res => setTeams(res.data.data?.teams || res.data.teams || []))
      .catch(() => setError('No se pudieron cargar los equipos'))
      .finally(() => setLoading(false))
  }, [])

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-12"><div className="card p-8 text-center text-text-muted">{error}</div></div>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-text-primary">Equipos</h1>
        <p className="text-text-secondary text-sm mt-1">Explorá todos los equipos de las distintas ligas</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton w-16 h-16 rounded-full mx-auto" />
              <div className="skeleton h-4 w-24 mx-auto" />
              <div className="skeleton h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {teams.map((team, i) => (
            <motion.div key={team.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
              <Link to={`/equipos/${team.id}`} className="card p-5 flex flex-col items-center gap-3 hover:border-accent-green/40 hover:shadow-glow transition-all duration-200 group">
                <div className="w-16 h-16 rounded-full bg-bg-tertiary border border-border flex items-center justify-center overflow-hidden group-hover:border-accent-green/30 transition-colors">
                  {team.logo_path
                    ? <img src={resolveAssetPath(team.logo_path)} alt={team.name} className="w-12 h-12 object-contain" />
                    : <span className="text-xl font-bold text-text-muted">{team.name?.[0]}</span>}
                </div>
                <div className="text-center min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate max-w-full">{team.name}</p>
                  {team.League && <p className="text-2xs text-text-muted mt-0.5 truncate">{team.League.name}</p>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && teams.length === 0 && (
        <div className="card p-12 text-center text-text-muted text-sm">
          No hay equipos disponibles
        </div>
      )}
    </motion.div>
  )
}
