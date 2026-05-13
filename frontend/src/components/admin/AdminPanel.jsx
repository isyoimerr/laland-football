import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import useAuthStore from '@store/authStore'

// Components
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import Dashboard from './sections/Dashboard'
import UsersManager from './sections/UsersManager'
import TeamsManager from './sections/TeamsManager'
import PlayersManager from './sections/PlayersManager'
import MatchesManager from './sections/MatchesManager'
import LeaguesManager from './sections/LeaguesManager'
import StadiumsManager from './sections/StadiumsManager'
import AssetsManager from './sections/AssetsManager'

export default function AdminPanel() {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirigir si no es admin
  if (user?.role !== 'admin' && user?.role !== 'super_admin' && user?.role !== 'demo') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-full"
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/usuarios" element={<UsersManager />} />
              <Route path="/equipos" element={<TeamsManager />} />
              <Route path="/jugadores" element={<PlayersManager />} />
              <Route path="/partidos" element={<MatchesManager />} />
              <Route path="/ligas" element={<LeaguesManager />} />
              <Route path="/estadios" element={<StadiumsManager />} />
              <Route path="/assets" element={<AssetsManager />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  )
}