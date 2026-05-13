import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '@store/authStore'

const HIGHLIGHTS = [
  { icon: '⚡', text: 'Live scores en tiempo real vía WebSocket' },
  { icon: '📊', text: 'Estadísticas avanzadas xG, posesión y mapa de tiros' },
  { icon: '🤖', text: 'Predicciones con inteligencia artificial' },
  { icon: '🏆', text: 'Rankings y goleadores actualizados al minuto' },
]

const DEMO_USER = {
  id: 0,
  name: 'Usuario Demo',
  email: 'demo@lalandfootball.com',
  role: 'demo',
  avatar: null,
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleDemo = async () => {
    setDemoLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setAuth(DEMO_USER, 'demo-token', 'demo-refresh-token')
    setDemoLoading(false)
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      let data = {}
      try { data = await res.json() } catch { /* respuesta sin body */ }
      if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión')

      // Guardar tokens y usuario en el store
      const { user, accessToken, refreshToken } = data.data
      setAuth(user, accessToken, refreshToken)
      navigate('/admin')
    } catch (err) {
      if (err.name === 'TypeError') {
        setError('No se puede conectar al servidor. Asegurate de que el backend esté corriendo.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex bg-bg-primary">
      {/* ── Panel izquierdo — visual ──────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
        {/* Video de fondo */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero-login.webm"
        />
        {/* Overlay oscuro con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg-primary/90 via-bg-primary/70 to-bg-primary/95" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 70%, rgba(0,212,161,0.12) 0%, transparent 60%)' }}
        />

        {/* Partículas */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 ? '#00d4a1' : '#3b82f6',
              }}
              animate={{ opacity: [0, 0.7, 0], y: [0, -50, 0] }}
              transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 5 }}
            />
          ))}
        </div>

        {/* Contenido panel izquierdo */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <Link to="/">
            <img src="/logo.svg" alt="LALAND Football" className="h-10 w-auto" />
          </Link>

          {/* Quote + features */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-black text-text-primary leading-tight mb-2">
                El fútbol en vivo,
                <br />
                <span
                  style={{ background: 'linear-gradient(135deg, #00d4a1, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  a otro nivel.
                </span>
              </h2>
              <p className="text-text-secondary text-xs leading-relaxed max-w-xs">
                Más de 12,000 usuarios ya siguen sus equipos con estadísticas profesionales y alertas en tiempo real.
              </p>
            </motion.div>

            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {HIGHLIGHTS.map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-text-secondary text-xs">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Footer panel izquierdo */}
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} LALAND Football
          </p>
        </div>
      </div>

      {/* ── Panel derecho — formulario ───────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        {/* Fondo sutil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.04) 0%, transparent 50%)' }}
        />

        <motion.div
          className="w-full max-w-sm relative z-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/">
              <img src="/logo.svg" alt="LALAND Football" className="h-9 w-auto" />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-black text-text-primary mb-1">Bienvenido de vuelta</h1>
            <p className="text-text-secondary text-xs">Ingresá a tu cuenta para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs text-text-secondary font-medium">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-base"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs text-text-secondary font-medium">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-xs text-accent-green hover:underline"
                >
                  ¿Olvidaste la contraseña?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-base"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                className="flex items-center gap-2 p-3 rounded-lg bg-accent-red/10 border border-accent-red/20"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
              >
                <svg className="w-4 h-4 text-accent-red shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p className="text-accent-red text-xs">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold"
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="w-4 h-4 border-2 border-bg-primary/40 border-t-bg-primary rounded-full inline-block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                  />
                  Ingresando...
                </span>
              ) : 'Ingresar'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-text-muted text-xs">o</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Botón demo */}
          <motion.button
            type="button"
            onClick={handleDemo}
            disabled={demoLoading}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-lg border text-sm font-semibold transition-all duration-200 relative overflow-hidden"
            style={{ borderColor: '#f59e0b44', background: 'rgba(245,158,11,0.06)', color: '#f59e0b' }}
            whileHover={{ background: 'rgba(245,158,11,0.12)', borderColor: '#f59e0b88' }}
            whileTap={{ scale: 0.98 }}
          >
            {demoLoading ? (
              <>
                <motion.span
                  className="w-4 h-4 border-2 rounded-full border-amber-400/40 border-t-amber-400 inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                />
                Entrando al demo...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 5.5l4 2.5-4 2.5V5.5z" fill="currentColor"/>
                </svg>
                Probar sin registrarse — Demo gratis
              </>
            )}
          </motion.button>

          <p className="text-center text-text-muted mt-4 text-xs">
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="text-accent-green font-semibold hover:underline">
              Registrate gratis
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-1.5 text-text-muted" style={{ fontSize: '10px' }}>
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L7.5 4.5H11L8.5 7l1 4L6 9 2.5 11l1-4L1 4.5h3.5z" fill="currentColor" opacity="0.5"/>
              </svg>
              Gratis para siempre
            </div>
            <div className="flex items-center gap-1.5 text-text-muted" style={{ fontSize: '10px' }}>
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
                <path d="M4 5V4a2 2 0 1 1 4 0v1" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
              </svg>
              100% seguro
            </div>
            <div className="flex items-center gap-1.5 text-text-muted" style={{ fontSize: '10px' }}>
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
                <path d="M4 6l1.5 1.5L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
              </svg>
              Sin spam
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
