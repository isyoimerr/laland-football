import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Live Score en Tiempo Real',
    desc: 'Goles, tarjetas y sustituciones al instante vía WebSocket. Cronómetro sincronizado.',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.15)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 3h18v18H3z" stroke="none"/>
        <path d="M4 20L8 14l4 3 4-6 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="17" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="11" r="1.5" fill="currentColor"/>
        <circle cx="20" cy="16" r="1.5" fill="currentColor"/>
      </svg>
    ),
    title: 'Estadísticas Avanzadas',
    desc: 'xG, posesión, mapa de tiros, comparativas radar y gráficos animados de nivel profesional.',
    color: '#00d4a1',
    glow: 'rgba(0,212,161,0.15)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16l-4.9 2.2.9-5.5L4 8.8l5.5-.8L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Predicciones con IA',
    desc: 'Algoritmo Elo + Poisson para probabilidades de resultado. MVP automático al cierre.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.15)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Perfiles Completos',
    desc: 'Jugadores, técnicos, equipos y estadios con historial, estadísticas y rendimiento.',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.15)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Panel Administrativo',
    desc: 'Control total para transmitir partidos en vivo, registrar eventos y gestionar la plataforma.',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.15)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Rankings Dinámicos',
    desc: 'Tabla de posiciones, goleadores, asistidores y forma reciente actualizados en tiempo real.',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.15)',
  },
]

const CONTAINER = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const ITEM = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-bg-secondary relative">
      {/* Separador superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-light to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent-green text-xs font-bold tracking-widest uppercase mb-3">
            Todo en una plataforma
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary">
            Diseñado para los que viven el fútbol
          </h2>
          <p className="text-text-secondary text-xs mt-3 max-w-lg mx-auto leading-relaxed">
            Desde el live score hasta la predicción con inteligencia artificial — LALAND Football
            tiene todo lo que necesitás para seguir el juego a otro nivel.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {FEATURES.map((feat) => (
            <motion.div
              key={feat.title}
              variants={ITEM}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative p-6 rounded-xl border border-border group cursor-default overflow-hidden"
              style={{ background: '#0a0e1a' }}
            >
              {/* Glow al hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-xl"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${feat.glow} 0%, transparent 60%)` }}
              />
              {/* Borde color top */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: feat.color }}
              />

              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 relative z-10"
                style={{ background: feat.glow, color: feat.color }}
              >
                {feat.icon}
              </div>

              <h3 className="text-text-primary font-bold text-sm mb-2 relative z-10">{feat.title}</h3>
              <p className="text-text-secondary text-xs leading-relaxed relative z-10">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
