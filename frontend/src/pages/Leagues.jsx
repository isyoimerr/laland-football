import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@services/api'
import { resolveAssetPath } from '@utils/imageUtils'

export default function Leagues() {
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/leagues')
      .then(res => setLeagues(res.data.data?.leagues || res.data.leagues || []))
      .catch(() => setError('No se pudieron cargar las competiciones'))
      .finally(() => setLoading(false))
  }, [])

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-12"><div className="card p-8 text-center text-text-muted">{error}</div></div>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
      className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-text-primary">Competiciones</h1>
        <p className="text-text-secondary text-sm mt-1">Explorá ligas, clasificaciones y resultados</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 space-y-3">
              <div className="skeleton w-14 h-14 rounded-full mx-auto" />
              <div className="skeleton h-5 w-32 mx-auto" />
              <div className="skeleton h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {leagues.map((league, i) => (
            <motion.div key={league.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
              <Link to={`/competiciones/${league.id}`} className="card p-6 flex flex-col items-center gap-3 hover:border-accent-green/40 hover:shadow-glow transition-all duration-200 group">
                <div className="w-14 h-14 rounded-full bg-bg-tertiary border border-border flex items-center justify-center overflow-hidden group-hover:border-accent-green/30 transition-colors">
                  {league.logo_path
                    ? <img src={resolveAssetPath(league.logo_path)} alt={league.name} className="w-10 h-10 object-contain" />
                    : <span className="text-lg font-bold text-text-muted">{league.name?.[0]}</span>}
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-text-primary">{league.name}</p>
                  {league.country && <p className="text-2xs text-text-muted mt-0.5">{league.country}</p>}
                  {league.Teams && <p className="text-2xs text-accent-green mt-1">{league.Teams.length} equipos</p>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && leagues.length === 0 && (
        <div className="card p-12 text-center text-text-muted text-sm">
          No hay competiciones disponibles
        </div>
      )}
    </motion.div>
  )
}
