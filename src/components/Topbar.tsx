import type { ComponentType, SVGProps } from 'react'
import { Link, matchPath, useLocation } from 'react-router'
import { account } from '../data/account'
import { usePipeline } from '../state/AppContext'
import Avatar from './Avatar'
import { BackIcon, ChatIcon, ChevronDownIcon, ChevronRightIcon, DashboardIcon, PipelineIcon } from './Icons'
import ThemeToggle from './ThemeToggle'
import './Topbar.css'

const SECTIONS: Record<string, { label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
  '/chat': { label: 'Chat', Icon: ChatIcon },
  '/dashboard': { label: 'Dashboard', Icon: DashboardIcon },
  '/pipelines': { label: 'Pipelines', Icon: PipelineIcon },
}

// The bar across the top of every screen: where you are (left) and
// theme + account (right). Sticky with a frosted background, so it stays
// put while the page scrolls underneath.
export default function Topbar() {
  const { pathname } = useLocation()
  // Topbar sits outside the screens, so it reads the pipeline id from the
  // URL itself instead of useParams.
  const detail = matchPath('/pipelines/:pipelineId', pathname)
  const pipeline = usePipeline(detail?.params.pipelineId)
  const section = SECTIONS[detail ? '/pipelines' : pathname]

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <nav className="topbar__crumbs" aria-label="Breadcrumb">
          {/* Section icon in a tinted square: a touch of brand color. */}
          {section && (
            <span className="topbar__icon" aria-hidden="true">
              <section.Icon />
            </span>
          )}
          {detail ? (
            <>
              {/* On a pipeline: "Pipelines › Sales vs target". The first part is
                  the way back; on phones it becomes a "‹ Pipelines" button. */}
              <Link to="/pipelines" className="topbar__back">
                <BackIcon className="topbar__back-arrow" aria-hidden="true" />
                Pipelines
              </Link>
              <ChevronRightIcon className="topbar__sep" aria-hidden="true" />
              <span className="topbar__current" aria-current="page">
                {pipeline?.name ?? 'Not found'}
              </span>
            </>
          ) : (
            <span className="topbar__title" aria-current="page">
              {section?.label ?? 'Astera Studio'}
            </span>
          )}
        </nav>

        <div className="topbar__actions">
          <ThemeToggle className="btn btn--icon topbar__theme" />
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}

// Account menu built on the native Popover API: popoverTarget connects the
// button to the panel, and the browser handles open/close, Esc and
// "tap outside to close" (light dismiss) with no extra JavaScript.
function AccountMenu() {
  return (
    <>
      <button className="topbar__account" popoverTarget="account-menu" aria-label={`Account: ${account.name}`}>
        <Avatar size={32} />
        {/* Name + role beside the avatar on desktop only. */}
        <span className="topbar__who" aria-hidden="true">
          <span className="topbar__who-name">{account.name}</span>
          <span className="topbar__who-role">{account.role}</span>
        </span>
        <ChevronDownIcon className="topbar__chev" aria-hidden="true" />
      </button>

      <div id="account-menu" popover="auto" className="account-menu">
        <div className="account-menu__head">
          <Avatar size={44} />
          <div>
            <p className="account-menu__name">{account.name}</p>
            <p className="account-menu__role">{account.role}</p>
          </div>
        </div>
        <dl className="account-menu__meta">
          <div>
            <dt>Workspace</dt>
            <dd>{account.workspace}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{account.email}</dd>
          </div>
        </dl>
        {/* Mockup: these just close the menu. */}
        <div className="account-menu__items">
          {['Profile', 'Settings', 'Help'].map((item) => (
            <button key={item} className="account-menu__item" popoverTarget="account-menu" popoverTargetAction="hide">
              {item}
            </button>
          ))}
          <button className="account-menu__item account-menu__item--quiet" popoverTarget="account-menu" popoverTargetAction="hide">
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}
