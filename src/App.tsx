// Temporary screen for chunk 0: proves the build, tokens and dark mode work.
// Replaced by the real app shell + router in chunk 1.
const statuses = [
  { label: 'Succeeded', color: 'var(--ok)', bg: 'var(--ok-soft)' },
  { label: 'Failed', color: 'var(--fail)', bg: 'var(--fail-soft)' },
  { label: 'Running', color: 'var(--run)', bg: 'var(--run-soft)' },
  { label: 'Scheduled', color: 'var(--sched)', bg: 'var(--sched-soft)' },
]

export default function App() {
  return (
    <main style={{ padding: 'var(--s-5)', display: 'grid', gap: 'var(--s-4)' }}>
      <h1 style={{ fontSize: 'var(--fs-xl)' }}>Astera Studio</h1>
      <p style={{ color: 'var(--text-2)' }}>Scaffold OK. Toggle your OS dark mode to check the tokens.</p>
      <div style={{ display: 'flex', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
        {statuses.map((s) => (
          <span
            key={s.label}
            style={{ color: s.color, background: s.bg, padding: '4px 10px', borderRadius: 999, fontSize: 'var(--fs-sm)' }}
          >
            ● {s.label}
          </span>
        ))}
      </div>
    </main>
  )
}
