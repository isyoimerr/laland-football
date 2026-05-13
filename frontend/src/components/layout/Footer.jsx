import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="LALAND Football" className="h-7 w-auto opacity-75" draggable="false" />
          </div>
          <p className="text-text-muted text-xs text-center">
            Estadísticas y resultados de fútbol en tiempo real.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-text-muted hover:text-text-secondary text-xs transition-base">
              Inicio
            </Link>
            <Link to="/login" className="text-text-muted hover:text-text-secondary text-xs transition-base">
              Acceder
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-text-muted text-xs">© {new Date().getFullYear()} LALAND Football. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
