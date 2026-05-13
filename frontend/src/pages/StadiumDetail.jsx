import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, Calendar } from 'lucide-react'
import api from '@services/api'
import { resolveAssetPath } from '@utils/imageUtils'

export default function StadiumDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [stadium, setStadium] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch stadium
      const stadiumRes = await api.get(`/stadiums/${id}`)
      setStadium(stadiumRes.data.data || stadiumRes.data.stadium)
      
      // Fetch matches at this stadium
      const matchesRes = await api.get('/matches')
      const allMatches = matchesRes.data.data?.matches || matchesRes.data.matches || []
      const stadiumMatches = allMatches.filter(
        m => Number(m.stadium_id) === Number(id)
      )
      setMatches(stadiumMatches)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar estadio')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-accent-teal border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-muted">Cargando estadio...</p>
        </div>
      </div>
    )
  }

  if (error || !stadium) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Estadio no encontrado'}</p>
          <button
            onClick={() => navigate('/stadiums')}
            className="btn-primary"
          >
            Volver a Estadios
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header con volver */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-40 p-2 rounded-lg bg-bg-secondary hover:bg-bg-tertiary transition text-text-primary"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Hero Section */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {stadium.image_path ? (
          <img
            src={resolveAssetPath(stadium.image_path)}
            alt={stadium.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
            <MapPin size={64} className="text-blue-200 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
        
        {/* Título sobre imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-black text-text-primary mb-2">
            {stadium.name}
          </h1>
          <div className="flex items-center gap-2 text-text-muted">
            <MapPin size={16} />
            <span>{stadium.city}, {stadium.country}</span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Capacidad */}
          <div className="card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-accent-teal" size={20} />
              <span className="text-text-muted text-sm">Capacidad</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {stadium.capacity ? stadium.capacity.toLocaleString('es-ES') : 'N/A'}
            </p>
          </div>

          {/* País */}
          <div className="card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="text-accent-red" size={20} />
              <span className="text-text-muted text-sm">País</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {stadium.country || 'N/A'}
            </p>
          </div>
        </div>

        {/* Partidos en este estadio */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Partidos en {stadium.name}
          </h2>

          {matches.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <p>No hay partidos registrados en este estadio</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map(match => (
                <div
                  key={match.id}
                  className="card p-4 rounded-lg flex items-center justify-between hover:bg-bg-tertiary transition cursor-pointer"
                  onClick={() => navigate(`/partidos/${match.id}`)}
                >
                  <div className="flex-1">
                    <p className="text-sm text-text-muted mb-1">
                      {match.date_time ? new Date(match.date_time).toLocaleDateString('es-ES') : 'Sin fecha'}
                    </p>
                    <p className="text-text-primary font-semibold">
                      {match.homeTeam?.name || 'Local'} vs {match.awayTeam?.name || 'Visitante'}
                    </p>
                  </div>
                  <div className="text-right">
                    {match.status === 'finished' ? (
                      <p className="text-xl font-bold text-accent-teal">
                        {match.home_score} - {match.away_score}
                      </p>
                    ) : match.status === 'live' ? (
                      <p className="text-sm px-3 py-1 bg-accent-red text-white rounded-full font-semibold">
                        EN VIVO
                      </p>
                    ) : (
                      <p className="text-sm text-text-muted">Por jugar</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
