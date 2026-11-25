import { useEffect, useState } from 'react'
import { getTheme, setTheme, subscribe } from './theme-store'
import type { Theme } from './theme-store'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getTheme())
  useEffect(() => subscribe(setThemeState), [])
  return { theme, setTheme }
}
