import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function MainLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-dvh flex flex-col bg-bg-primary">
      <Navbar />
      <main className={`flex-1 w-full ${isHome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
