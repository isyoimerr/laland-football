import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ImageWithFallback from '@components/common/ImageWithFallback'
import { getTeamInitials } from '@utils/imageUtils'

const MATCHES = [
  {
    competition: 'UEFA Champions League',
    competitionColor: '#3b82f6',
    status: 'live',
    minute: "74'",
    home: { name: 'Real Madrid', score: 2, abbr: 'RMA', badge: '/badges/badge-realmadrid.svg' },
    away: { name: 'Manchester City', score: 1, abbr: 'MCI', badge: '/badges/badge-generic.svg' },
    stadium: 'Santiago Bernabéu',
    stadiumImg: '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Estadio_01_panoramica.webp',
    stats: { possession: [58, 42], shots: [14, 8] },
  },
  {
    competition: 'LaLiga Santander',
    competitionColor: '#ef4444',
    status: 'live',
    minute: "32'",
    home: { name: 'Barcelona', score: 1, abbr: 'BAR', badge: '/badges/badge-barcelona.svg' },
    away: { name: 'Atlético Madrid', score: 1, abbr: 'ATM', badge: '/badges/badge-atletico.svg' },
    stadium: 'Spotify Camp Nou',
    stadiumImg: '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Estadio_02_interior.webp',
    stats: { possession: [62, 38], shots: [9, 5] },
  },
  {
    competition: 'Premier League',
    competitionColor: '#a78bfa',
    status: 'upcoming',
    time: '20:45',
    home: { name: 'Liverpool', score: null, abbr: 'LIV', badge: '/badges/badge-generic.svg' },
    away: { name: 'Arsenal', score: null, abbr: 'ARS', badge: '/badges/badge-generic.svg' },
    stadium: 'Anfield',
    stadiumImg: '/assets/MISCELÁNEOS/FOTOS_JUGADORES_ESTADIOS/Estadio_03_nocturno.webp',
    stats: null,
  },
]

function StatBar({ label, homeVal, awayVal, color }) {
  const homeWidth = `${homeVal}%`
  const awayWidth = `${awayVal}%`
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-text-muted" style={{ fontSize: '10px' }}>
        <span>{homeVal}%</span>
        <span className="text-text-muted">{label}</span>
        <span>{awayVal}%</span>
      </div>
      <div className="flex gap-0.5 h-1 rounded-full overflow-hidden bg-bg-tertiary">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          whileInView={{ width: homeWidth }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.div
          className="h-full rounded-full bg-border-light"
          initial={{ width: 0 }}
          whileInView={{ width: awayWidth }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}

function TeamBadge({ team, size = 40 }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <ImageWithFallback
        src={team.badge}
        alt={team.name}
        type="team"
        initials={team.abbr}
        className="rounded-lg overflow-hidden"
        style={{ width: size, height: size }}
      />
      <p className="text-text-primary text-xs font-semibold leading-tight text-center max-w-20">{team.name}</p>
    </div>
  )
}

function MatchCard({ match, delay }) {
  return (
    <motion.div
      className="card overflow-hidden group hover:border-border-light transition-colors duration-200"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Stadium image strip */}
      <div className="relative h-16 overflow-hidden">
        <img
          src={match.stadiumImg}
          alt={match.stadium}
          className="w-full h-full object-cover object-center"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-secondary/95" />
        <div className="absolute inset-0 bg-bg-primary/40" />
        {/* Competition badge overlay */}
        <div className="absolute top-2 left-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: match.competitionColor }} />
          <span className="text-white text-xs font-semibold" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            {match.competition}
          </span>
        </div>
        {/* Live / time badge */}
        <div className="absolute top-2 right-3">
          {match.status === 'live' ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-red/90 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold">{match.minute}</span>
            </div>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-bg-secondary/80 backdrop-blur-sm text-text-muted text-xs">
              {match.time}
            </span>
          )}
        </div>
      </div>

      {/* Marcador */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <TeamBadge team={match.home} />

          {/* Marcador central */}
          <div className="text-center px-2 flex-shrink-0">
            {match.status === 'live' ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-text-primary">{match.home.score}</span>
                <span className="text-text-muted font-black text-lg">–</span>
                <span className="text-2xl font-black text-text-primary">{match.away.score}</span>
              </div>
            ) : (
              <span
                className="px-3 py-1.5 text-xs font-bold rounded-lg"
                style={{ background: 'rgba(0,212,161,0.1)', color: '#00d4a1' }}
              >
                vs
              </span>
            )}
            <p className="text-text-muted mt-1 text-center" style={{ fontSize: '10px' }}>{match.stadium}</p>
          </div>

          <TeamBadge team={match.away} />
        </div>

        {/* Stats mini (solo partidos en vivo) */}
        {match.stats && (
          <div className="mt-4 space-y-2 border-t border-border pt-3">
            <StatBar label="Posesión" homeVal={match.stats.possession[0]} awayVal={match.stats.possession[1]} color={match.competitionColor} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function MatchesPreview() {
  return (
    <section className="py-24 px-4 bg-bg-secondary relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent-green text-xs font-bold tracking-widest uppercase mb-3">
            Partidos en vivo ahora
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary">
            Seguí cada partido como si estuvieras ahí
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MATCHES.map((match, i) => (
            <MatchCard key={i} match={match} delay={i * 0.12} />
          ))}
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/competiciones" className="btn-secondary text-xs inline-flex items-center gap-2">
            Ver todos los partidos →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
