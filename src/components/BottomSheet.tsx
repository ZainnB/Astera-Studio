import { useCallback, useEffect, useId, useRef, type PointerEvent, type ReactNode } from 'react'
import './BottomSheet.css'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const CLOSE_MS = 280 // keep in sync with the transition in BottomSheet.css
const DISMISS_DISTANCE = 100 // px dragged down…
const DISMISS_SPEED = 0.5 // …or a quick flick, in px per ms

// A panel that slides up from the bottom: the phone-friendly home for
// controls that don't fit on screen (e.g. dashboard filters). It can be
// dragged down to dismiss, like native iOS sheets.
//
// Built on the native <dialog> element, which gives us for free:
//   - a dimmed backdrop (::backdrop)
//   - focus kept inside while open, and returned afterwards
//   - Esc to close
//   - the rest of the page made inert for screen readers
export default function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  // Current drag, kept in a ref: it changes on every pointer move, and
  // re-rendering React 60 times a second for that would be wasteful.
  const drag = useRef<{ startY: number; startTime: number; dy: number } | null>(null)

  // React state says open/closed; this syncs the real <dialog> to it.
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Every way of closing (drag, Done, backdrop, Esc) slides the sheet down
  // first, then really closes it.
  const dismiss = useCallback(() => {
    const dialog = ref.current
    if (!dialog) return
    dialog.classList.add('sheet--closing')
    dialog.style.transform = 'translateY(100%)'
    window.setTimeout(() => {
      dialog.close()
      dialog.classList.remove('sheet--closing')
      dialog.style.transform = ''
      onClose()
    }, CLOSE_MS)
  }, [onClose])

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    // A press on the Done button should stay a normal tap, not start a drag.
    if ((e.target as HTMLElement).closest('button')) return
    drag.current = { startY: e.clientY, startTime: e.timeStamp, dy: 0 }
    // Keep receiving moves even if the finger slides off the handle.
    e.currentTarget.setPointerCapture(e.pointerId)
    ref.current?.classList.add('sheet--dragging') // follow the finger with no lag
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    const dialog = ref.current
    if (!d || !dialog) return
    d.dy = Math.max(0, e.clientY - d.startY) // down only; it can't be pulled up past the top
    dialog.style.transform = `translateY(${d.dy}px)`
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    const dialog = ref.current
    drag.current = null
    if (!d || !dialog) return
    dialog.classList.remove('sheet--dragging')
    const speed = d.dy / Math.max(1, e.timeStamp - d.startTime)
    if (d.dy > DISMISS_DISTANCE || speed > DISMISS_SPEED) dismiss()
    else dialog.style.transform = '' // not far enough: spring back (CSS animates it)
  }

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault() // Esc: use our slide-down instead of an instant close
        dismiss()
      }}
      // A tap on the dimmed backdrop lands on the <dialog> itself (the panel
      // inside covers everything else), so that's our "tap outside to close".
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div className="sheet__panel">
        {/* The drag area: grab bar + header. */}
        <div
          className="sheet__grab"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="sheet__handle" aria-hidden="true" />
          <header className="sheet__header">
            <h2 id={titleId} className="sheet__title">
              {title}
            </h2>
            <button className="btn btn--ghost" onClick={dismiss}>
              Done
            </button>
          </header>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </dialog>
  )
}
