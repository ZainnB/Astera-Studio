import { useEffect, useId, useRef, type ReactNode } from 'react'
import './BottomSheet.css'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

// A panel that slides up from the bottom: the phone-friendly home for
// controls that don't fit on screen (e.g. dashboard filters).
//
// Built on the native <dialog> element, which gives us for free:
//   - a dimmed backdrop (::backdrop)
//   - focus kept inside while open, and returned afterwards
//   - Esc to close
//   - the rest of the page made inert for screen readers
export default function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  // React state says open/closed; this syncs the real <dialog> to it.
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={titleId}
      onClose={onClose}
      // A tap on the dimmed backdrop lands on the <dialog> itself (the panel
      // inside covers everything else), so that's our "tap outside to close".
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="sheet__panel">
        <div className="sheet__handle" aria-hidden="true" />
        <header className="sheet__header">
          <h2 id={titleId} className="sheet__title">
            {title}
          </h2>
          <button className="btn btn--ghost" onClick={onClose}>
            Done
          </button>
        </header>
        <div className="sheet__body">{children}</div>
      </div>
    </dialog>
  )
}
