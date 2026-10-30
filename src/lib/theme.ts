import { useSyncExternalStore } from 'react'

// Light / dark / follow the device. The colors themselves are all in
// tokens.css: choosing a theme only sets data-theme on <html>, and the
// matching block of CSS variables takes over.
//
// This is a tiny store outside React (like the media-query hook), because
// several components show the toggle and must agree on the current value.

export type ThemePref = 'system' | 'light' | 'dark'

const KEY = 'astera-theme' // same key as the inline script in index.html
const listeners = new Set<() => void>()
let current: ThemePref = readSaved()

function readSaved(): ThemePref {
  try {
    const saved = localStorage.getItem(KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'system'
  } catch {
    return 'system' // storage can be blocked (e.g. private browsing)
  }
}

export function setThemePref(pref: ThemePref) {
  current = pref
  try {
    if (pref === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, pref)
  } catch {
    // Not saved, but the switch still works for this visit.
  }

  const root = document.documentElement
  // For a moment, let every color fade instead of flipping instantly.
  root.classList.add('theme-switching')
  window.setTimeout(() => root.classList.remove('theme-switching'), 350)

  if (pref === 'system') delete root.dataset.theme
  else root.dataset.theme = pref

  listeners.forEach((notify) => notify())
}

export function useThemePref(): ThemePref {
  return useSyncExternalStore(subscribe, () => current)
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  return () => {
    listeners.delete(notify)
  }
}
