import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@services/api'
import ImageWithFallback from '@components/common/ImageWithFallback'
import Breadcrumbs from '@components/common/Breadcrumbs'

export default function CoachProfile() {
  const { id } = useParams()
  const [coach, setCoach] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/coaches/${id}`)
        const coachData = res.data.data?.coach || res.data.coach
        if (!coachData) throw new Error('Entrenador no encontrado')
        setCoach(coachData)
      } catch (err) {
        setError(err.message || 'Error al cargar entrenador')
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

  if (error || !coach) {
    return <div className="container max-w-5xl mx-auto px-4 py-6 text-center text-text-muted">
      {error || 'Entrenador no encontrado'}
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
        ...(coach.Team ? [{ label: coach.Team.name, href: `/equipos/${coach.Team.id}` }] : []),
        { label: coach.name }
      ]} />

      <div className="card p-6 space-y-4">
        <div className="flex items-start gap-6">
          <ImageWithFallback
            src={coach.photo_path}
            alt={coach.name}
            type="player"
            className="w-24 h-24 rounded-full"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-black text-text-primary">{coach.name}</h1>
            <p className="text-text-muted text-sm mt-1">
              <span className="inline-block px-2.5 py-1 rounded bg-accent-green/10 text-accent-green text-2xs font-semibold">
                {coach.role || 'Head Coach'}
              </span>
            </p>
            {coach.Team && (
              <Link to={`/equipos/${coach.Team.id}`} className="text-accent-teal hover:text-accent-teal-light text-sm mt-3 transition block">
                {coach.Team.name}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <h2 className="section-title text-sm">Información</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {coach.nationality && (
            <div>
              <span className="text-text-muted text-2xs">Nacionalidad</span>
              <p className="text-text-primary font-semibold">{coach.nationality}</p>
            </div>
          )}
          {coach.birth_date && (
            <div>
              <span className="text-text-muted text-2xs">Fecha de Nacimiento</span>
              <p className="text-text-primary font-semibold">
                {new Date(coach.birth_date).toLocaleDateString('es-ES')}
              </p>
            </div>
          )}
          {coach.role && (
            <div>
              <span className="text-text-muted text-2xs">Rol</span>
              <p className="text-text-primary font-semibold">{coach.role}</p>
            </div>
          )}
          {coach.Team && (
            <div>
              <span className="text-text-muted text-2xs">Equipo</span>
              <p className="text-text-primary font-semibold">{coach.Team.name}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
