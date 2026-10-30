import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number towards `target`: from 0 on first show, and from the
 * old value to the new one whenever `target` changes (e.g. a filter).
 * When the user has asked their device to reduce motion, it simply returns
 * the target: no animation, no extra renders.
 */
export function useCountUp(target: number, duration = 800): number {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [value, setValue] = useState(0)
  // Where the number currently is, so an interrupted animation (filter
  // changed mid-count) continues smoothly from there.
  const current = useRef(0)

  useEffect(() => {
    if (reduceMotion) return
    const from = current.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out: fast at first, settles gently
      current.current = from + (target - from) * eased
      setValue(current.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame) // stop if the card unmounts or target changes
  }, [target, duration, reduceMotion])

  return reduceMotion ? target : value
}
