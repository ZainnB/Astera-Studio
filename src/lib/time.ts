// Mock timestamps are created relative to "now" when the app loads, so the demo
// always reads naturally ("failed 2 hours ago"), whatever day a reviewer opens it.

const MINUTE = 60_000

export function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * MINUTE).toISOString()
}

export function minutesFromNow(minutes: number): string {
  return new Date(Date.now() + minutes * MINUTE).toISOString()
}

// Built-in browser formatter: produces "5 minutes ago", "yesterday", "in 3 hours".
const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/** "just now", "12 min ago", "2 hours ago", "yesterday", "in 3 hours"… */
export function formatRelative(iso: string): string {
  const diffMin = Math.round((new Date(iso).getTime() - Date.now()) / MINUTE)
  const abs = Math.abs(diffMin)
  if (abs < 1) return 'just now'
  if (abs < 60) return relative.format(diffMin, 'minute')
  if (abs < 60 * 24) return relative.format(Math.round(diffMin / 60), 'hour')
  return relative.format(Math.round(diffMin / (60 * 24)), 'day')
}

/** "6:04 AM" */
export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
