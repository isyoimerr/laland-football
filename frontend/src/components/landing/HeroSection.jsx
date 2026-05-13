import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '@store/authStore'
import api from '@services/api'
import { startAmbient, stopAmbient } from '@utils/soundUtils'

const LIVE_MATCHES = [
  { home: 'Real Madrid', away: 'Man City', h: 2, a: 1, min: "73'", comp: 'Champions League', color: '#3b82f6' },
  { home: 'Barcelona', away: 'PSG', h: 1, a: 1, min: "58'", comp: 'LaLiga', color: '#ef4444' },
  { home: 'Bayern', away: 'Dortmund', h: 3, a: 0, min: "88'", comp: 'Bundesliga', color: '#f59e0b' },
]

const BADGES = [
  { icon: '⚡', label: 'Live en tiempo real' },
  { icon: '📊', label: 'Estadísticas xG' },
  { icon: '🤖', label: 'Predicciones IA' },
  { icon: '🏆', label: '5 ligas top' },
]

const SLIDES = [
  { type: 'video', src: '/assets/VIDEOS/Highlights/Bayern_vs_Dortmund_Bundesliga.mp4' },
  { type: 'image', src: '/landing-image.webp' },
  { type: 'video', src: '/assets/VIDEOS/Highlights/Tottenham_vs_Liverpool_UCL_Final.mp4' },
  { type: 'image', src: '/landing-image.webp' },
]

// Campo de fútbol como elemento decorativo de fondo (SVG puro, sin imágenes)
function FootballField() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      viewBox="0 0 800 500"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Campo exterior */}
      <rect x="60" y="40" width="680" height="420" rx="4" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
      {/* Línea del medio */}
      <line x1="400" y1="40" x2="400" y2="460" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
      {/* Círculo central */}
      <circle cx="400" cy="250" r="70" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
      {/* Punto central */}
      <circle cx="400" cy="250" r="3" fill="white" fillOpacity="0.05" />
      {/* Área grande izquierda */}
      <rect x="60" y="145" width="110" height="210" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
      {/* Área pequeña izquierda */}
      <rect x="60" y="195" width="45" height="110" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
      {/* Arco área izq */}
      <path d="M 170 185 A 70 70 0 0 1 170 315" stroke="white" strokeWidth="1" strokeOpacity="0.03" />
      {/* Punto penal izq */}
      <circle cx="120" cy="250" r="2.5" fill="white" fillOpacity="0.05" />
      {/* Área grande derecha */}
      <rect x="630" y="145" width="110" height="210" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
      {/* Área pequeña derecha */}
      <rect x="695" y="195" width="45" height="110" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
      {/* Arco área der */}
      <path d="M 630 185 A 70 70 0 0 0 630 315" stroke="white" strokeWidth="1" strokeOpacity="0.03" />
      {/* Punto penal der */}
      <circle cx="680" cy="250" r="2.5" fill="white" fillOpacity="0.05" />
      {/* Esquinas */}
      <path d="M 60 40 A 12 12 0 0 1 72 52" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
      <path d="M 740 40 A 12 12 0 0 0 728 52" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
      <path d="M 60 460 A 12 12 0 0 0 72 448" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
      <path d="M 740 460 A 12 12 0 0 1 728 448" stroke="white" strokeWidth="1" strokeOpacity="0.04" />
    </svg>
  )
}

function LiveCard({ match, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border-light bg-bg-secondary/60 backdrop-blur-sm"
      style={{ boxShadow: `0 0 20px ${match.color}10` }}
    >
      {/* Indicador live */}
      <div className="flex flex-col items-center gap-0.5 flex-shrink-0 w-10">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: match.color }} />
        <span className="text-2xs font-bold" style={{ color: match.color }}>{match.min}</span>
      </div>

      {/* Equipos */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-text-primary truncate">{match.home}</span>
          <span className="text-sm font-black text-text-primary w-4 text-center">{match.h}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-text-secondary truncate">{match.away}</span>
          <span className="text-sm font-black text-text-secondary w-4 text-center">{match.a}</span>
        </div>
      </div>

      {/* Liga */}
      <div className="flex-shrink-0">
        <span
          className="text-2xs font-bold px-2 py-0.5 rounded-md"
          style={{ background: `${match.color}18`, color: match.color }}
        >
          {match.comp}
        </span>
      </div>
    </motion.div>
  )
}

export default function HeroSection() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)

  useEffect(() => {
    startAmbient()
    return () => stopAmbient()
  }, [])

  // ─── Background Slideshow ─────────────────────────────────
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRefs = useRef({})
  const timerRef = useRef(null)

  const advance = useCallback((nextIndex) => {
    setActiveIndex(nextIndex)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % SLIDES.length)
    }, 4500)
  }, [])

  useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach(v => { try { v.pause() } catch {} })
    }
  }, [])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idx, video]) => {
      if (!video) return
      if (Number(idx) === activeIndex) {
        video.currentTime = 0
        video.play().catch(() => {})
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }, [activeIndex])

  const goNext = useCallback(() => advance((activeIndex + 1) % SLIDES.length), [activeIndex, advance])
  const goPrev = useCallback(() => advance((activeIndex - 1 + SLIDES.length) % SLIDES.length), [activeIndex, advance])

  const handleDemo = async () => {
    try {
      const res = await api.post('/auth/login', {
        email: 'demo@lalandfootball.com',
        password: 'demo1234',
      })
      const { user, accessToken, refreshToken } = res.data.data
      setAuth(user, accessToken, refreshToken)
    } catch {
      // Si el backend no está disponible, entramos en modo demo offline
      setAuth({ id: 0, name: 'Usuario Demo', email: 'demo@lalandfootball.com', role: 'super_admin' }, 'demo-offline', 'demo-offline')
    }
    navigate('/admin')
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg-primary" style={{ transform: 'translateZ(0)' }}>

      {/* ── Background Slideshow ────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: i === activeIndex ? 1 : 0,
              willChange: 'opacity',
              transform: 'scale(1.1)',
            }}
          >
            {slide.type === 'video' ? (
              <video
                ref={el => { if (el) videoRefs.current[i] = el }}
                muted playsInline preload="metadata"
                className="w-full h-full object-cover"
                style={{ filter: 'blur(10px)' }}
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <img
                src={slide.src}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: 'blur(10px)' }}
                loading={i <= 1 ? 'eager' : 'lazy'}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Overlay oscuro sobre el video ────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/70 via-bg-primary/40 to-bg-primary/80 pointer-events-none" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10,14,26,0.6) 100%)' }} pointer-events="none" />

      {/* ── Fondos con gradientes ────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-2/3 h-2/3" style={{ background: 'radial-gradient(ellipse at 10% 10%, rgba(0,212,161,0.15) 0%, transparent 55%)' }} />
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3" style={{ background: 'radial-gradient(ellipse at 90% 90%, rgba(59,130,246,0.12) 0%, transparent 55%)' }} />
        <div className="absolute top-1/2 right-1/4 w-1/2 h-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(245,158,11,0.06) 0%, transparent 50%)' }} />
      </div>

      {/* ── Campo de fútbol como fondo ───────────────────────── */}
      <FootballField />

      {/* ── Grid sutil ──────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Navegación del slideshow ──────────────────────────── */}
      <button
        onClick={goPrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[9] w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
        aria-label="Anterior"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[9] w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
        aria-label="Siguiente"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>

      {/* ── Contenido principal ──────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Columna izquierda — texto */}
          <div>
            {/* Badge live */}
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border"
              style={{ borderColor: 'rgba(0,212,161,0.25)', background: 'rgba(0,212,161,0.06)' }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-red" />
              </span>
              <span className="text-2xs font-bold text-accent-green tracking-widest uppercase">
                Live · Estadísticas · Tiempo real
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="block text-text-primary">El fútbol</span>
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #00d4a1 0%, #3b82f6 50%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                en vivo
              </span>
              <span className="block text-text-primary">a otro nivel.</span>
            </motion.h1>

            {/* Descripción */}
            <motion.p
              className="text-text-secondary text-sm leading-relaxed max-w-md mb-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Live scores, estadísticas xG, posesión, heatmaps y predicciones con IA —
              todo en una plataforma de nivel profesional.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-3 mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Link
                to="/registro"
                className="btn-primary px-7 py-3 text-sm font-bold shadow-glow"
              >
                Comenzar gratis
              </Link>
              <button
                onClick={handleDemo}
                className="flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold border transition-all duration-200"
                style={{ borderColor: 'rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.06)', color: '#f59e0b' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.06)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M5.5 4.5l4 2.5-4 2.5V4.5z" fill="currentColor"/>
                </svg>
                Ver demo completo
              </button>
            </motion.div>

            {/* Feature badges */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {BADGES.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-tertiary border border-border text-2xs text-text-secondary"
                >
                  <span>{b.icon}</span>
                  {b.label}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Columna derecha — tarjetas live */}
          <div className="space-y-3 relative">
            {/* Header del panel */}
            <motion.div
              className="flex items-center justify-between mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Partidos en vivo</span>
              <span className="badge badge-live text-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1" />
                EN VIVO
              </span>
            </motion.div>

            {LIVE_MATCHES.map((m, i) => (
              <LiveCard key={i} match={m} delay={0.4 + i * 0.12} />
            ))}

            {/* Panel de stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="mt-4 grid grid-cols-3 gap-2"
            >
              {[
                { val: '98%', label: 'Uptime', color: '#00d4a1' },
                { val: '<1s', label: 'Latencia', color: '#3b82f6' },
                { val: '20+', label: 'Partidos hoy', color: '#a855f7' },
              ].map(s => (
                <div key={s.label} className="card p-3 text-center">
                  <span className="text-sm font-black" style={{ color: s.color }}>{s.val}</span>
                  <p className="text-2xs text-text-muted mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Glow detrás del panel derecho */}
            <div
              className="absolute -right-8 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none -z-10"
              style={{ background: 'radial-gradient(circle, rgba(0,212,161,0.08) 0%, transparent 70%)' }}
            />
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-2xs text-text-muted uppercase tracking-widest">Explorá más</span>
        <div className="w-5 h-8 rounded-full border border-border flex items-start justify-center pt-1.5">
          <motion.div
            className="w-1 h-2 rounded-full bg-accent-green"
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
