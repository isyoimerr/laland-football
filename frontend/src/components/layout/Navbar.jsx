import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import useAuthStore from '@store/authStore'
import SearchBar from '@components/common/SearchBar'

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/competiciones', label: 'Competiciones' },
  { to: '/equipos', label: 'Equipos' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-bg-secondary/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/logo.svg"
            alt="LALAND Football"
            className="h-9 w-auto transition-opacity duration-200 group-hover:opacity-80"
            draggable="false"
          />
        </Link>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `btn-ghost text-xs ${isActive ? 'text-text-primary bg-bg-tertiary' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Search */}
        <div className="hidden lg:block flex-1 mx-6 max-w-sm">
          <SearchBar />
        </div>

        {/* Auth section desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Badge demo */}
              {user?.role === 'demo' && (
                <motion.span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Modo Demo
                </motion.span>
              )}
              {/* Avatar + nombre */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(0,212,161,0.2)', color: '#00d4a1' }}
                >
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="text-text-secondary text-xs max-w-24 truncate">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-ghost text-xs text-text-muted">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-xs">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="btn-primary text-xs">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden btn-ghost p-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span className="sr-only">Menú</span>
          <div className="w-5 flex flex-col gap-1">
            <span className={`h-0.5 bg-text-primary transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`h-0.5 bg-text-primary transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 bg-text-primary transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden border-t border-border bg-bg-secondary px-4 py-3 flex flex-col gap-1"
          >
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `btn-ghost text-xs justify-start ${isActive ? 'text-text-primary bg-bg-tertiary' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="divider my-1" />
            {isAuthenticated ? (
              <>
                {user?.role === 'demo' && (
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-400 text-xs font-semibold">Modo Demo activo</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(0,212,161,0.2)', color: '#00d4a1' }}>
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="text-text-secondary text-xs">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-xs justify-start text-text-muted">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-xs justify-start" onClick={() => setMenuOpen(false)}>
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="btn-primary text-xs justify-center" onClick={() => setMenuOpen(false)}>
                  Registrarse
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
