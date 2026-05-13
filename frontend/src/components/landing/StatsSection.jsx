import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

const STATS = [
  { value: 12500, label: 'Usuarios activos', suffix: '+', color: '#00d4a1' },
  { value: 64, label: 'Competiciones', suffix: '', color: '#3b82f6' },
  { value: 980, label: 'Equipos registrados', suffix: '+', color: '#f59e0b' },
  { value: 48000, label: 'Partidos analizados', suffix: '+', color: '#ef4444' },
]

function AnimatedNumber({ value, suffix, color }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: 2000, bounce: 0 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString('es-AR'))

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, motionValue, value])

  return (
    <span ref={ref} className="text-2xl sm:text-3xl font-black" style={{ color }}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

export default function StatsSection() {
  return (
    <section className="py-20 px-4 bg-bg-primary relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,161,0.05) 0%, transparent 60%)' }}
      />

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-bg-secondary flex flex-col items-center justify-center py-10 px-4 text-center gap-1"
            >
              <AnimatedNumber value={stat.value} suffix={stat.suffix} color={stat.color} />
              <p className="text-text-secondary text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
