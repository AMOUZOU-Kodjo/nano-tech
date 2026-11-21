import { useCallback, useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'nanofile.theme'
const THEMES = ['system', 'light', 'dark']
const THEME_COLORS = { light: '#ffffff', dark: '#0b1120' }

function normalizeTheme(value) {
  return THEMES.includes(value) ? value : 'system'
}

function writeStoredTheme(value) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, value)
    return true
  } catch {
    return false
  }
}

function readStoredTheme() {
  if (typeof window === 'undefined') {
    return 'system'
  }

  try {
    return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return 'system'
  }
}

function readSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolvedTheme) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')

  const themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) {
    themeColor.setAttribute('content', THEME_COLORS[resolvedTheme])
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState(readStoredTheme)
  const [systemTheme, setSystemTheme] = useState(readSystemTheme)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => setSystemTheme(event.matches ? 'dark' : 'light')

    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
      return () => media.removeEventListener('change', handleChange)
    }

    media.addListener(handleChange)
    return () => media.removeListener(handleChange)
  }, [])

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === THEME_STORAGE_KEY) {
        setThemeState(normalizeTheme(event.newValue))
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = useCallback((nextTheme) => {
    const normalized = normalizeTheme(nextTheme)
    setThemeState(normalized)
    writeStoredTheme(normalized)

    return normalized
  }, [])

  const cycleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      const nextTheme = currentTheme === 'light' ? 'dark' : currentTheme === 'dark' ? 'system' : 'light'
      writeStoredTheme(nextTheme)

      return nextTheme
    })
  }, [])

  return { theme, resolvedTheme, isDark: resolvedTheme === 'dark', setTheme, cycleTheme }
}
