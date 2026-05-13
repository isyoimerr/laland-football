import { motion } from 'framer-motion'

const PLAYERS = [
  {
    name: 'Cristiano Ronaldo',
    country: 'Portugal',
    number: '7',
    color: '#ef4444',
    flag: '🇵🇹',
    pos: 'Delantero',
    stats: { goals: 900, assists: 240, titles: 35 },
  },
  {
    name: 'Lionel Messi',
    country: 'Argentina',
    number: '10',
    color: '#3b82f6',
    flag: '🇦🇷',
    pos: 'Delantero',
    stats: { goals: 843, assists: 365, titles: 44 },
  },
  {
    name: 'Kylian Mbappé',
    country: 'Francia',
    number: '9',
    color: '#00d4a1',
    flag: '🇫🇷',
    pos: 'Delantero',
    stats: { goals: 384, assists: 188, titles: 18 },
  },
  {
    name: 'Erling Haaland',
    country: 'Noruega',
    number: '9',
    color: '#a855f7',
    flag: '🇳🇴',
    pos: 'Delantero',
    stats: { goals: 311, assists: 62, titles: 9 },
  },
]

const CONTAINER = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const CARD = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

function PlayerCard({ player }) {
  return (
    <motion.div
      variants={CARD}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative rounded-xl border border-border overflow-hidden group cursor-default"
      style={{ background: '#0d1220' }}
    >
      {/* Franja de color superior */}
      <div className="h-0.5 w-full" style={{ background: player.color }} />

      {/* Número de camiseta — fondo decorativo */}
      <div
        className="absolute top-2 right-3 text-7xl font-black select-none pointer-events-none leading-none"
        style={{ color: player.color, opacity: 0.06 }}
        aria-hidden="true"
      >
        {player.number}
      </div>

      {/* Glow hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 0%, ${player.color}12 0%, transparent 60%)` }}
      />

      {/* Contenido */}
      <div className="p-5 relative z-10">
        {/* País + flag */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-base">{player.flag}</span>
          <span className="text-2xs text-text-muted">{player.country}</span>
          <span className="ml-auto badge text-2xs border" style={{ color: player.color, background: `${player.color}12`, borderColor: `${player.color}25` }}>
            #{player.number}
          </span>
        </div>

        {/* Nombre */}
        <h3 className="text-sm font-black text-text-primary leading-tight mb-1">{player.name}</h3>
        <p className="text-2xs text-text-muted mb-4">{player.pos}</p>

        {/* Divider */}
        <div className="h-px w-full mb-3" style={{ background: `linear-gradient(to right, ${player.color}30, transparent)` }} />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1 text-center">
          <div>
            <p className="text-sm font-black" style={{ color: player.color }}>{player.stats.goals}</p>
            <p className="text-2xs text-text-muted mt-0.5">Goles</p>
          </div>
          <div>
            <p className="text-sm font-black text-text-secondary">{player.stats.assists}</p>
            <p className="text-2xs text-text-muted mt-0.5">Asist.</p>
          </div>
          <div>
            <p className="text-sm font-black text-accent-amber">{player.stats.titles}</p>
            <p className="text-2xs text-text-muted mt-0.5">Títulos</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function PlayersSection() {
  return (
    <section className="py-24 px-4 bg-bg-primary relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,161,0.04) 0%, transparent 60%)' }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent-green text-2xs font-bold tracking-widest uppercase mb-3">
            Los mejores del mundo
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary">
            Seguí las estrellas del fútbol global
          </h2>
          <p className="text-text-secondary text-xs mt-3 max-w-md mx-auto leading-relaxed">
            Estadísticas completas, historial y rendimiento de los jugadores más destacados.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PLAYERS.map(player => (
            <PlayerCard key={player.name} player={player} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
