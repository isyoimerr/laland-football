import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '@store/authStore'

export default function AdminHeader() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const ROLE_BADGE = {
    super_admin: { label: 'Super Admin', color: 'text-accent-red bg-accent-red/10 border-accent-red/20' },
    admin: { label: 'Admin', color: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20' },
    user: { label: 'Usuario', color: 'text-accent-green bg-accent-green/10 border-accent-green/20' },
  }
  const badge = ROLE_BADGE[user?.role] ?? ROLE_BADGE.user

  return (
    <header className="h-14 flex-shrink-0 bg-bg-secondary border-b border-border flex items-center justify-between px-5">
      {/* Logo + título */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center opacity-80 hover:opacity-100 transition-opacity">
          <img src="/logo.svg" alt="LALAND Football" className="h-7 w-auto" draggable="false" />
        </Link>
        <span className="text-border">|</span>
        <span className="text-xs font-semibold text-text-muted">Panel de Control</span>
      </div>

      {/* Derecha — usuario + acciones */}
      <div className="flex items-center gap-3">
        {/* Rol badge */}
        <span className={`badge border text-2xs font-bold ${badge.color}`}>
          {badge.label}
        </span>

        {/* Nombre */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-bg-tertiary border border-border">
          <div className="w-5 h-5 rounded-full bg-accent-green/20 flex items-center justify-center">
            <span className="text-2xs font-bold text-accent-green">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <span className="text-xs font-medium text-text-secondary max-w-28 truncate">{user?.name}</span>
        </div>

        {/* Ver sitio */}
        <Link to="/" className="btn-ghost text-2xs py-1.5 px-3 hidden sm:flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 7l3.5 3.5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Ver sitio
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="btn-ghost text-2xs py-1.5 px-3 text-accent-red hover:bg-accent-red/10"
        >
          Salir
        </button>
      </div>
    </header>
  )
}
