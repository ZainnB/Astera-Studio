import { Link } from 'react-router'
import { CodeIcon, GlobeIcon, LinkedInIcon } from './Icons'
import './Footer.css'

const links = [
  { to: '/chat', label: 'Chat' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/pipelines', label: 'Pipelines' },
  { to: '/pipelines/sales', label: 'Sales vs target pipeline' },
]

const LINKEDIN = 'https://www.linkedin.com/in/zain-baig-04790b260/'
const GITHUB = 'https://github.com/ZainnB/astera-studio'
const LIVE = 'https://zainnb.github.io/astera-studio/'

// Three tidy columns: what this is · where to go · who built it, then a
// bottom bar. Stacks on phones, sits side by side on bigger screens.
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
          <p className="footer__dev-name">Zain Baig</p>
          <p className="footer__dev-meta">FAST · Batch 2026</p>
          <ul className="footer__list footer__list--icons">
            <li>
              <a href={LINKEDIN} target="_blank" rel="noreferrer">
                <LinkedInIcon aria-hidden="true" />
                LinkedIn
              </a>
            </li>
            <li>
              <a href={GITHUB} target="_blank" rel="noreferrer">
                <CodeIcon aria-hidden="true" />
                Source on GitHub
              </a>
            </li>
            <li>
              <a href={LIVE} target="_blank" rel="noreferrer">
                <GlobeIcon aria-hidden="true" />
                Live demo
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bar">
        <div className="footer__bar-inner">
          <p>© 2026 Zain Baig · Design mockup, all data is made up</p>
          <div className="footer__social">
            <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="Zain Baig on LinkedIn">
              <LinkedInIcon aria-hidden="true" />
            </a>
            <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="Source code on GitHub">
              <CodeIcon aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
