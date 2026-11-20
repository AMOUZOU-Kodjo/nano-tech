import { createContext } from 'react'
import { useMe } from '@/hooks/useMe.js'

// Contexte unique du profil courant ; il centralise les données, les états et le rechargement.
// Le contexte reste avec son provider pour garantir une seule source de vérité.
// eslint-disable-next-line react-refresh/only-export-components
export const MeContext = createContext(null)

// Fournit une seule instance de useMe à tous les composants descendants.
export function MeProvider({ children }) {
  const me = useMe()

  return <MeContext.Provider value={me}>{children}</MeContext.Provider>
}
