import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import useAuthStore from '@store/authStore'

const MENU = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'teams',
    label: 'Equipos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 1.5C9 1.5 6 5 6 9s3 7.5 3 7.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M9 1.5C9 1.5 12 5 12 9s-3 7.5-3 7.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1.5 9h15" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: 'players',
    label: 'Jugadores',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'matches',
    label: 'Partidos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="3" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 3v12M13 3v12M1 9h16" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    id: 'videos',
    label: 'Videos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="4" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <polygon points="7,7 12,9 7,11" stroke="currentColor" strokeWidth="1.2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'leagues',
    label: 'Ligas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.4l-3.7 1.9.7-4.1L3 6.3l4.2-.7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'stadiums',
    label: 'Estadios',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 14h16M3 14V8M15 14V8M3 8C3 5 5 3 9 3s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <ellipse cx="9" cy="8" rx="4" ry="2" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
]

export default function AdminSidebar({ active, setActive }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuthStore()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex-shrink-0 bg-bg-secondary border-r border-border flex flex-col overflow-hidden"
      style={{ minHeight: 0 }}
    >
      {/* Top — colapsar */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border flex-shrink-0">
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-bold text-text-muted uppercase tracking-widest select-none"
            >
              Panel
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="btn-ghost p-1.5 ml-auto"
          aria-label="Colapsar menú"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}>
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {MENU.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-accent-green/10 text-accent-green'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-accent-green' : ''}`}>
                {item.icon}
              </span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 w-0.5 h-6 bg-accent-green rounded-r"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Rol del usuario */}
      <div className="px-3 py-3 border-t border-border flex-shrink-0">
        <div className={`flex items-center gap-2 px-2 py-2 rounded-lg bg-bg-tertiary ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xs font-bold text-accent-green">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-2xs font-semibold text-text-primary truncate">{user?.name}</p>
                <p className="text-2xs text-text-muted capitalize">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}
