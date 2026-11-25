export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'jobbeacon-admin-theme'

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readStored(): Theme | null {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'light' || value === 'dark' ? value : null
}

export function getTheme(): Theme {
  return readStored() ?? (systemPrefersDark() ? 'dark' : 'light')
}

const listeners = new Set<(theme: Theme) => void>()

export function setTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme)
  document.documentElement.setAttribute('data-theme', theme)
  listeners.forEach((listener) => listener(theme))
}

export function subscribe(listener: (theme: Theme) => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// Applied as soon as this module loads (before React renders), so there's no flash of the wrong theme.
document.documentElement.setAttribute('data-theme', getTheme())
