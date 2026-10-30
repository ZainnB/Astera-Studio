import { Link } from 'react-router'
import './Footer.css'

const links = [
  { to: '/chat', label: 'Chat' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/pipelines', label: 'Pipelines' },
  { to: '/pipelines/sales', label: 'Sales vs target pipeline' },
]

// Three tidy columns: what this is · where to go · who built it.
// Stacks on phones, sits side by side on bigger screens.
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col footer__brand">
          <p className="footer__name">
            <span className="footer__logo" aria-hidden="true">
              A
            </span>
            Astera Studio
          </p>
          <p className="footer__desc">
            Chat-first analytics for business users: ask in plain language, pin the answers to a dashboard, and keep an eye on
            the pipelines behind every number, from any device.
          </p>
          <p className="footer__fine">Design mockup · all data is made up</p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__heading">Navigate</h2>
          <ul className="footer__list">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">Developer</h2>
          <ul className="footer__list">
            <li className="footer__plain">Zain Baig</li>
            <li className="footer__plain">FAST · Batch 2026</li>
            <li>
              <a href="https://github.com/ZainnB/Astera_Flow" target="_blank" rel="noreferrer">
                Source on GitHub
              </a>
            </li>
            <li>
              <a href="https://zainnb.github.io/Astera_Flow/" target="_blank" rel="noreferrer">
                Live demo
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
