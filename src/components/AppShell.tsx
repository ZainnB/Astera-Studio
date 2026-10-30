import { Outlet, useLocation } from 'react-router'
import NavBar from './NavBar'
import ThemeToggle from './ThemeToggle'
import './AppShell.css'

// The frame around every screen: navigation + a content area.
// <Outlet /> is where React Router renders the current screen.
export default function AppShell() {
  const { pathname } = useLocation()

  return (
    <div className="shell">
      <NavBar />
      <main className="shell__main">
        {/* Phone only (CSS hides it on bigger screens, where the nav has one). */}
        <ThemeToggle className="btn btn--ghost btn--icon shell__theme" />

        {/* Screen transition: key={pathname} gives each screen a fresh wrapper,
            so its fade-in animation plays on every navigation. Only the path
            counts, so choosing a pipeline step (?step=…) doesn't re-animate. */}
        <div key={pathname} className="shell__page">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
