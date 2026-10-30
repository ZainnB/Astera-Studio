import { Outlet } from 'react-router'
import NavBar from './NavBar'
import './AppShell.css'

// The frame around every screen: navigation + a content area.
// <Outlet /> is where React Router renders the current screen.
export default function AppShell() {
  return (
    <div className="shell">
      <NavBar />
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  )
}
