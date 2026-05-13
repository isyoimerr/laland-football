import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg-primary">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-accent-green"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
            />
          ))}
        </div>
        <span className="text-text-muted text-xs">Cargando...</span>
      </motion.div>
    </div>
  )
}
