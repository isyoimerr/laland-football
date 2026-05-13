import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="py-28 px-4 bg-bg-primary relative overflow-hidden">
      {/* Fondo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,161,0.07) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)' }}
      />
      {/* Líneas de decoración */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-green/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-green/20 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <div className="flex justify-center lg:justify-start mb-6">
              <img src="/favicon.svg" alt="" className="w-14 h-14" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-text-primary leading-tight mb-4">
              Viví el fútbol a{' '}
              <span
                style={{ background: 'linear-gradient(135deg, #00d4a1, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                otro nivel
              </span>
            </h2>
            <p className="text-text-secondary text-sm mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Registrate gratis y seguí tus equipos favoritos con estadísticas profesionales,
              alertas en tiempo real y predicciones con inteligencia artificial.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Link to="/registro" className="btn-primary px-10 py-3 text-sm font-bold shadow-glow">
                Crear cuenta gratis
              </Link>
              <Link to="/login" className="btn-ghost text-sm text-text-secondary hover:text-text-primary">
                Ya tengo cuenta →
              </Link>
            </div>

            <p className="text-text-muted text-xs mt-6">
              Sin tarjeta de crédito · Sin compromisos · 100% gratuito
            </p>
          </motion.div>

          {/* Mockup app */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <img
                src="/mockups/mockup-app.svg"
                alt="LALAND Football App"
                className="w-full max-w-lg rounded-2xl"
                draggable="false"
              />
              {/* Glow bajo el mockup */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full blur-2xl opacity-40"
                style={{ background: 'linear-gradient(90deg, #00d4a1, #3b82f6)' }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
