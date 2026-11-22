import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

const LOCALES = ['fr', 'en']
const LOCALE_STORAGE_KEY = 'nanofile.locale'

// eslint-disable-next-line react-refresh/only-export-components
export const LocaleContext = createContext(null)

function normalizeLocale(value) {
  return LOCALES.includes(value) ? value : null
}

function detectBrowserLocale() {
  if (typeof navigator === 'undefined') {
    return 'fr'
  }

  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language]

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') {
      continue
    }

    const normalized = candidate.toLowerCase()
    if (normalized.startsWith('fr')) {
      return 'fr'
    }
    if (normalized.startsWith('en')) {
      return 'en'
    }
  }

  return 'fr'
}

function readInitialLocale() {
  if (typeof window === 'undefined') {
    return 'fr'
  }

  try {
    const stored = normalizeLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY))
    if (stored) {
      return stored
    }
  } catch {
    return detectBrowserLocale()
  }

  return detectBrowserLocale()
}

// Fournit une seule source de vérité pour la langue de l'interface et sa persistance.
export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(readInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale

    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
      return undefined
    }
  }, [locale])

  useEffect(() => {
    function handleStorage(event) {
      const next = normalizeLocale(event.newValue)
      if (next) {
        setLocaleState(next)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const setLocale = useCallback((next) => {
    const normalized = normalizeLocale(next)
    if (normalized) {
      setLocaleState(normalized)
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((current) => (current === 'fr' ? 'en' : 'fr'))
  }, [])

  const t = useCallback(
    (value) => {
      if (typeof value === 'string') {
        return value
      }
      if (!value || typeof value !== 'object') {
        return ''
      }

      return value[locale] ?? value.fr ?? Object.values(value)[0] ?? ''
    },
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
