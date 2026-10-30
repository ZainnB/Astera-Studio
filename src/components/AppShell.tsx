import { Outlet, useLocation } from 'react-router'
import Footer from './Footer'
import NavBar from './NavBar'
import Topbar from './Topbar'
import './AppShell.css'

// The frame around every screen:
//   [ nav ][ topbar                ]
//          [ main: current screen  ]
//          [ footer                ]
// <Outlet /> is where React Router renders the current screen.
export default function AppShell() {
  const { pathname } = useLocation()
  // Chat keeps its message box pinned to the bottom of the screen, like any
  // chat app, so it has no footer underneath.
  const showFooter = !pathname.startsWith('/chat')

  return (
    <div className="shell">
      <NavBar />
      <div className="shell__body">
        <Topbar />
        <main className="shell__main">
          {/* Screen transition: key={pathname} gives each screen a fresh wrapper,
              so its fade-in animation plays on every navigation. Only the path
              counts, so choosing a pipeline step (?step=…) doesn't re-animate. */}
          <div key={pathname} className="shell__page">
            <Outlet />
          </div>
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  )
}
