import { useCallback, useSyncExternalStore } from 'react'

// Breakpoints: keep in sync with the comment at the top of tokens.css.
export const PHONE_QUERY = '(max-width: 699px)'
export const DESKTOP_QUERY = '(min-width: 1200px)'

/**
 * true/false for a CSS media query, updating live when it changes
 * (window resized, iPad rotated, OS dark mode toggled).
 *
 * Most responsive behavior is plain CSS. This hook is only for when the
 * *structure* must change, e.g. the pipeline is a list on phones but a canvas
 * on bigger screens. Those are different components, not different styles.
 *
 * useSyncExternalStore is React's built-in way to subscribe to something
 * outside React (here: the browser's matchMedia).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}

export type Breakpoint = 'phone' | 'tablet' | 'desktop'

export function useBreakpoint(): Breakpoint {
  const phone = useMediaQuery(PHONE_QUERY)
  const desktop = useMediaQuery(DESKTOP_QUERY)
  return phone ? 'phone' : desktop ? 'desktop' : 'tablet'
}
