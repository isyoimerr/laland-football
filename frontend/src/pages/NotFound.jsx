import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-bg-primary flex items-center justify-center px-4">
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-2xl font-black text-gradient">404</div>
        <div className="space-y-2">
          <h1 className="section-title">Página no encontrada</h1>
          <p className="text-text-secondary text-xs max-w-sm mx-auto">
            La página que buscás no existe o fue movida.
          </p>
        </div>
        <Link to="/" className="btn-primary inline-flex">
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  )
}
