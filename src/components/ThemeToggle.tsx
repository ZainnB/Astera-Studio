import { setThemePref, useThemePref, type ThemePref } from '../lib/theme'
import { MonitorIcon, MoonIcon, SunIcon } from './Icons'

const NEXT: Record<ThemePref, ThemePref> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<ThemePref, string> = { system: 'Auto', light: 'Light', dark: 'Dark' }
const ICON = { system: MonitorIcon, light: SunIcon, dark: MoonIcon }

// One button that cycles Auto → Light → Dark. "Auto" follows the device
// setting. The icon shows the current choice; the aria-label says it in words.
export default function ThemeToggle({ className }: { className: string }) {
  const pref = useThemePref()
  const Icon = ICON[pref]

  return (
    <button
      className={className}
      onClick={() => setThemePref(NEXT[pref])}
      aria-label={`Theme: ${LABEL[pref]}. Switch to ${LABEL[NEXT[pref]]}.`}
      title={`Theme: ${LABEL[pref]}`}
    >
      <Icon aria-hidden="true" />
    </button>
  )
}
