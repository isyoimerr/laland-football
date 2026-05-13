import { useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '@store/authStore'
import AdminSidebar from '@components/admin/AdminSidebar'
import AdminHeader from '@components/admin/AdminHeader'
import Dashboard from '@components/admin/sections/Dashboard'
import TeamsManager from '@components/admin/sections/TeamsManager'
import PageLoader from '@components/ui/PageLoader'

const PlayersManager = lazy(() => import('@components/admin/sections/PlayersManager'))
const MatchesManager = lazy(() => import('@components/admin/sections/MatchesManager'))
const LeaguesManager = lazy(() => import('@components/admin/sections/LeaguesManager'))
const StadiumsManager = lazy(() => import('@components/admin/sections/StadiumsManager'))
const VideosManager = lazy(() => import('@components/admin/sections/VideosManager'))

export default function Admin() {
  const [active, setActive] = useState('dashboard')
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh bg-bg-primary flex items-center justify-center px-4">
        <div className="card p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-accent-red/10 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-accent-red">
              <rect x="5" y="13" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M9 13V9a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="section-title mb-2">Acceso requerido</h1>
          <p className="text-xs text-text-muted mb-6">Debés iniciar sesión para acceder al panel.</p>
          <Link to="/login" className="btn-primary w-full justify-center">Iniciar sesión</Link>
        </div>
      </div>
    )
  }

  const renderSection = () => {
    switch (active) {
      case 'dashboard': return <Dashboard setActive={setActive} />
      case 'teams':     return <TeamsManager />
      case 'players':   return <Suspense fallback={<PageLoader />}><PlayersManager /></Suspense>
      case 'matches':   return <Suspense fallback={<PageLoader />}><MatchesManager /></Suspense>
      case 'leagues':   return <Suspense fallback={<PageLoader />}><LeaguesManager /></Suspense>
      case 'stadiums':  return <Suspense fallback={<PageLoader />}><StadiumsManager /></Suspense>
      case 'videos':    return <Suspense fallback={<PageLoader />}><VideosManager /></Suspense>
      default:          return <Dashboard setActive={setActive} />
    }
  }

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar active={active} setActive={setActive} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}
