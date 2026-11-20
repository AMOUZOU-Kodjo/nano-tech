import { useContext } from 'react'
import { MeContext } from '@/contexts/MeContext.jsx'

// Hook de lecture du profil courant ; il garantit que le provider est bien monté.
export function useMeContext() {
  const context = useContext(MeContext)

  if (!context) {
    throw new Error('useMeContext doit être utilisé dans MeProvider.')
  }

  return context
}
