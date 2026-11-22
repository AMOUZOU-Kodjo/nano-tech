import { useContext } from 'react'
import { LocaleContext } from '@/contexts/LocaleContext.jsx'

// Hook de lecture de la langue courante ; il garantit que le provider est bien monté.
export function useLocale() {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useLocale doit être utilisé dans LocaleProvider.')
  }

  return context
}
