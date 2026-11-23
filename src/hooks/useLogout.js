import { useCallback, useState } from 'react'
import { clearAnonId } from '@/api/client.js'
import { logout as logoutRequest } from '@/api/authApi.js'

// Hook métier : déconnecte l'utilisateur puis laisse l'appelant rafraîchir son profil.
export function useLogout({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // La réponse 204 est sans corps ; onSuccess est appelé uniquement après un succès.
  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await logoutRequest()
      clearAnonId()
      onSuccess?.()
      return result
    } catch (caughtError) {
      setError(caughtError)
      return null
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  return { loading, error, logout }
}
