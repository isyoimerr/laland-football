import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '@store/authStore'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      let data = {}
      try { data = await res.json() } catch { /* respuesta sin body */ }
      if (!res.ok) throw new Error(data.message || 'Error al registrarse')

      // Guardar tokens y usuario en el store
      const { user, accessToken, refreshToken } = data.data
      setAuth(user, accessToken, refreshToken)
      navigate('/')
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
    <div className="min-h-dvh bg-bg-primary flex items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-sm space-y-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <img src="/logo.svg" alt="LALAND Football" className="h-10 w-auto mx-auto" draggable="false" />
          </Link>
          <h1 className="text-lg font-bold text-text-primary">Crear cuenta</h1>
          <p className="text-text-secondary text-xs">Seguí tus equipos y recibí notificaciones en vivo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs text-text-secondary font-medium">
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input-base"
              placeholder="Juan García"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
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

          <div className="space-y-1">
            <label htmlFor="password" className="text-xs text-text-secondary font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="input-base"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-xs text-text-secondary font-medium">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="input-base"
              placeholder="Repetí tu contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && (
            <motion.p
              className="text-accent-red text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-text-muted text-xs">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-accent-green hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
