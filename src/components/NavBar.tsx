import { NavLink } from 'react-router'
import type { ComponentType, SVGProps } from 'react'
import { ChatIcon, DashboardIcon, PipelineIcon } from './Icons'
import ThemeToggle from './ThemeToggle'
import './NavBar.css'

interface NavItem {
  to: string
  label: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

const items: NavItem[] = [
  { to: '/chat', label: 'Chat', Icon: ChatIcon },
  { to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/pipelines', label: 'Pipelines', Icon: PipelineIcon },
]

// One nav, three layouts. The markup never changes; NavBar.css moves it to the
// bottom (phone), a left rail (tablet) or a full sidebar (desktop).
export default function NavBar() {
  return (
    <nav className="nav" aria-label="Main">
      <div className="nav__brand">
        <span className="nav__logo" aria-hidden="true">A</span>
        <span className="nav__name">Astera Studio</span>
      </div>
      <ul className="nav__list">
        {items.map(({ to, label, Icon }) => (
          <li key={to} className="nav__item">
            {/* NavLink adds class "active" + aria-current="page" when the URL
                starts with `to`, so /pipelines/sales keeps "Pipelines" lit. */}
            <NavLink to={to} className="nav__link">
              <Icon className="nav__icon" />
              <span className="nav__label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      {/* Pinned to the bottom of the rail/sidebar. On phones the tab bar has
          no room, so AppShell shows its own small toggle in the corner. */}
      <div className="nav__footer">
        <ThemeToggle className="nav__link nav__theme" showLabel />
      </div>
    </nav>
  )
}
