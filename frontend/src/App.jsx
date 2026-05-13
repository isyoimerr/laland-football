import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Suspense, lazy } from 'react'

// Pages — lazy loaded para mejor performance
const Home = lazy(() => import('@pages/Home'))
const MatchDetail = lazy(() => import('@pages/MatchDetail'))
const Teams = lazy(() => import('@pages/Teams'))
const TeamProfile = lazy(() => import('@pages/TeamProfile'))
const PlayerProfile = lazy(() => import('@pages/PlayerProfile'))
const CoachProfile = lazy(() => import('@pages/CoachProfile'))
const StadiumDetail = lazy(() => import('@pages/StadiumDetail'))
const Leagues = lazy(() => import('@pages/Leagues'))
const Competition = lazy(() => import('@pages/Competition'))
const Login = lazy(() => import('@pages/Login'))
const Register = lazy(() => import('@pages/Register'))
const Admin = lazy(() => import('@pages/Admin'))
const NotFound = lazy(() => import('@pages/NotFound'))

// Layout
import MainLayout from '@components/layout/MainLayout'
import PageLoader from '@components/ui/PageLoader'

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Rutas públicas con layout principal */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/partidos/:id" element={<MatchDetail />} />
              <Route path="/equipos" element={<Teams />} />
              <Route path="/equipos/:id" element={<TeamProfile />} />
              <Route path="/estadios/:id" element={<StadiumDetail />} />
              <Route path="/jugadores/:id" element={<PlayerProfile />} />
              <Route path="/tecnicos/:id" element={<CoachProfile />} />
              <Route path="/competiciones" element={<Leagues />} />
              <Route path="/competiciones/:id" element={<Competition />} />
            </Route>

            {/* Rutas de autenticación (sin layout principal) */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            {/* Panel admin */}
            <Route path="/admin/*" element={<Admin />} />

            {/* Redireccionamiento y 404 */}
            <Route path="/inicio" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </BrowserRouter>
  )
}
